<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ActiveStudents;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActiveStudentsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $activeStudents = ActiveStudents::all();

            return response()->json([
                "status" => "success",
                "message" => "Active students fetched successfully",
                "data" => $activeStudents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while fetching active students.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'school_year' => 'required|string',
            'generation' => 'required|string',
            'class' => 'required|string',
            'number_id' => 'required|string|exists:students,id_number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "message" => $validator->errors()->all(),
            ], 400);
        }

        try {
            $student = Students::where('id_number', $request->number_id)->first();

            if (!$student) {
                return response()->json([
                    "status" => "error",
                    "message" => "Student with ID number {$request->number_id} not found!",
                ], 404);
            }

            $activeStudent = ActiveStudents::create([
                'school_year' => $request->school_year,
                'generation' => $request->generation,
                'class' => $request->class,
                'student_id' => $student->id,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Active student created successfully",
                "data" => $activeStudent
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while creating active student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'school_year' => 'required|string',
            'generation' => 'required|string',
            'class' => 'required|string',
            'number_id' => 'required|string|exists:students,id_number',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "message" => $validator->errors()->all(),
            ], 400);
        }

        try {
            $activeStudent = ActiveStudents::find($id);

            if (!$activeStudent) {
                return response()->json([
                    "status" => "error",
                    "message" => "Active student not found.",
                ], 404);
            }

            $student = Students::where('id_number', $request->number_id)->first();

            if (!$student) {
                return response()->json([
                    "status" => "error",
                    "message" => "Student with ID number {$request->number_id} not found!",
                ], 404);
            }

            $activeStudent->update([
                'school_year' => $request->school_year,
                'generation' => $request->generation,
                'class' => $request->class,
                'student_id' => $student->id,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Active student updated successfully",
                "data" => $activeStudent
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while updating active student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $activeStudent = ActiveStudents::find($id);

            if (!$activeStudent) {
                return response()->json([
                    "status" => "error",
                    "message" => "Active student not found.",
                ], 404);
            }

            $activeStudent->delete();

            return response()->json([
                "status" => "success",
                "message" => "Active student deleted successfully",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while deleting active student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

public function import(Request $request)
{
    // Validasi awal untuk memastikan format data
    $validator = Validator::make($request->all(), [
        "data" => "required|array",
        'data.*.school_year' => 'required|string',
        'data.*.generation' => 'required|string',
        'data.*.class' => 'required|string',
        'data.*.number_id' => 'required|string',
    ]);

    if ($validator->fails()) {
        // Mengubah pesan error menjadi lebih informatif
        $errors = [];
        foreach ($validator->errors()->getMessages() as $field => $message) {
            // Mendapatkan index dari pesan error
            preg_match('/data\.(\d+)\./', $field, $matches);
            $index = $matches[1] ?? null;
            if ($index !== null) {
                foreach ($message as $msg) {
                    $errors[] = "Row $index: " . str_replace("data.{$index}.", "", $msg);
                }
            } else {
                $errors[] = implode(', ', $message);
            }
        }
        return response()->json([
            'message' => 'Data validation failed',
            'errors' => $errors
        ], 422);
    }

    $activeStudentsData = $request->input('data');
    $errors = [];
    $successCount = 0;

    foreach ($activeStudentsData as $key => $activeStudentData) {
        // Cek apakah student dengan id_number tersebut ada
        $student = Students::where('id_number', $activeStudentData['number_id'])->first();

        if (!$student) {
            $errors[] = "Siswa dengan ID number {$activeStudentData['number_id']} tidak ditemukan!";
            continue;
        }

        // Cek apakah student tersebut sudah ada di tabel ActiveStudents
        $existingActiveStudent = ActiveStudents::where('student_id', $student->id)
            ->where('school_year', $activeStudentData['school_year'])
            ->where('generation', $activeStudentData['generation'])
            ->where('class', $activeStudentData['class'])
            ->first();

        if ($existingActiveStudent) {
            $errors[] = "Active student with ID number {$activeStudentData['number_id']} at index {$key} already exists!";
            continue;
        }

        // Buat entri baru di tabel ActiveStudents
        try {
            ActiveStudents::create([
                'school_year' => $activeStudentData['school_year'],
                'generation' => $activeStudentData['generation'],
                'class' => $activeStudentData['class'],
                'student_id' => $student->id,
            ]);
            $successCount++;
        } catch (\Exception $e) {
            $errors[] = "Error importing student with ID number {$activeStudentData['number_id']} at index {$key}: " . $e->getMessage();
        }
    }

    if (!empty($errors)) {
        return response()->json([
            "message" => "There were errors during the import process.",
            "errors" => $errors,
            "success_count" => $successCount
        ], 400);
    }

    return response()->json([
        "message" => "Data imported successfully",
        "success_count" => $successCount
    ], 201);
}

}
