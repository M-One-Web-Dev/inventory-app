<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ActiveStudents;
use App\Models\User;
use App\Models\Students;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActiveStudentsController extends Controller
{
public function index(Request $request)
{
    try {
        // Ambil parameter pencarian dan pagination dari request
        $perPage = $request->query('perPage', 10); // Default 10 items per page
        $search = $request->query('search', '');

        // Query dengan pagination dan pencarian
        $activeStudents = ActiveStudents::with('student')
            ->when($search, function ($query, $search) {
                return $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                })->orWhere('class', 'like', "%{$search}%")
                  ->orWhere('generation', 'like', "%{$search}%")
                  ->orWhere('school_year', 'like', "%{$search}%");
            })
            ->paginate($perPage);


       

        // Transformasi data hanya pada items
        $data = $activeStudents->getCollection()->map(function ($activeStudent) {
            return [
                'id' => $activeStudent->id,
                'student_id' => $activeStudent->student_id,
                'student_name' => $activeStudent->student->name,
                'class' => $activeStudent->class,
                'generation' => $activeStudent->generation,
                'school_year' => $activeStudent->school_year,
                'created_at' => $activeStudent->created_at,
                'updated_at' => $activeStudent->updated_at,
            ];
        });

        // Set hasil transformasi kembali ke collection di paginator
        $activeStudents->setCollection($data);

             $totalPages = (int) ceil($activeStudents->total() / $activeStudents->perPage());

        return response()->json([
            "status" => "success",
            "message" => "Active students fetched successfully",
            "data" => $activeStudents->items(),  // Data untuk halaman saat ini
            "pagination" => [
                "total" => $activeStudents->total(),
                "perPage" => $activeStudents->perPage(),
                "currentPage" => $activeStudents->currentPage(),
                "lastPage" => $activeStudents->lastPage(),
                 "totalPages" => $totalPages,
            ],
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

            $user = User::where('id', $student->user_id)->first();
            if ($user) {
                $user->status = 'active';
                $user->save();
            }

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

public function delete(Request $request)
{
    try {
        $id = $request->input('id');

        // Validasi ID apakah sudah diberikan
        if (!$id) {
            return response()->json([
                "status" => "error",
                "message" => "ID is required.",
            ], 400);
        }

        $activeStudent = ActiveStudents::find($id);

        if (!$activeStudent) {
            return response()->json([
                "status" => "error",
                "message" => "Active student not found.",
            ], 404);
        }

        // Dapatkan data student_id sebelum menghapus
        $studentId = $activeStudent->student_id;

        // Hapus dari tabel active_students
        $activeStudent->delete();

        // Ubah status siswa menjadi inactive di tabel users
        $user = User::where('id', Students::where('id', $studentId)->first()->user_id)->first();
        if ($user) {
            $user->status = 'inactive';
            $user->save();
        }

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
    
    $validator = Validator::make($request->all(), [
        "data" => "required|array",
        'data.*.school_year' => 'required',
        'data.*.generation' => 'required',
        'data.*.class' => 'required',
        'data.*.number_id' => 'required',
    ]);

    if ($validator->fails()) {
       
        $errors = [];
        foreach ($validator->errors()->getMessages() as $field => $message) { 
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
       
        $student = Students::where('id_number', $activeStudentData['number_id'])->first();

        if (!$student) {
            $errors[] = "Siswa dengan ID number {$activeStudentData['number_id']} tidak ditemukan!";
            continue;
        }

 
        $existingActiveStudent = ActiveStudents::where('student_id', $student->id)
            ->where('school_year', $activeStudentData['school_year'])
            ->where('generation', $activeStudentData['generation'])
            ->where('class', $activeStudentData['class'])
            ->first();

        if ($existingActiveStudent) {
            $errors[] = "Siswa dengan Number ID {$activeStudentData['number_id']} telah terdaftar!";
            continue;
        }

     
        try {
            ActiveStudents::create([
                'school_year' => $activeStudentData['school_year'],
                'generation' => $activeStudentData['generation'],
                'class' => $activeStudentData['class'],
                'student_id' => $student->id,
            ]);

        
            $user = User::where('id', $student->user_id)->first();
            if ($user) {
                $user->status = 'active';
                $user->save();
            }

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
