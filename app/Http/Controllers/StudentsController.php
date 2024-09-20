<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Students;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StudentsController extends Controller
{
public function index()
{
    try {
        $perPage = request()->query('perPage', 10); // Default 10 items per page
        $search = request()->query('search', '');

        $students = Students::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                         ->orWhere('id_number', 'like', "%{$search}%")
                         ->orWhere('address', 'like', "%{$search}%")
                         ->orWhere('phone_number', 'like', "%{$search}%");
        })->paginate($perPage);

        
        $data = $students->getCollection()->map(function ($student) {
            return [
                "id" => $student->id,
                "user_id" => $student->user_id,
                "id_number" => $student->id_number,
                "name" => $student->name,
                "address" => $student->address,
                "phone_number" => $student->phone_number,
                "created_at" => $student->created_at,
                "updated_at" => $student->updated_at,
            ];
        });

      
        $students->setCollection($data);
 $totalPages = (int) ceil($students->total() / $students->perPage());

        return response()->json([
            "status" => "success",
            "message" => "Students fetched successfully",
            "data" => $students->items(),  // Data untuk halaman saat ini
            "pagination" => [
                "total" => $students->total(),
                "perPage" => $students->perPage(),
                "currentPage" => $students->currentPage(),
                "lastPage" => $students->lastPage(),
                 "totalPages" => $totalPages, 
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching students.",
            "error" => $e->getMessage()
        ], 500);
    }
}

    public function create(Request $request)
    {
        $validators = Validator::make($request->all(), [
            "username" => "required",
            "name" => "required",
            "password" => "required",
            "id_number" => "required|unique:students,id_number",
        ]);

        if ($validators->fails()) {
            return response()->json([
                "status" => "error",
                "message" => "Validation failed",
                "errors" => $validators->errors()
            ], 400);
        }

        // Create student and user
        try {
            $user = User::create([
                "username" => $request->username,
                "password" => Hash::make($request->password),
                "email" => null,
                "role" => "student",
                "status" =>"inactive"
            ]);

            $student = Students::create([
                "user_id" => $user->id,
                "name" => $request->username,
                "address" => null,
                "phone_number" => null,
                "id_number" => $request->id_number,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Student created successfully",
                "data" => [
                    "user" => $user,
                    "student" => $student
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while creating student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

public function import(Request $request)
{
    $validators = Validator::make($request->all(), [
        "data" => "required|array",
        'data.*.username' => 'required',
        'data.*.password' => 'required',
        'data.*.id_number' => 'required',
    ]);

    if ($validators->fails()) {
        $errors = [];
        foreach ($validators->errors()->getMessages() as $field => $message) {
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

    $students = $request->input('data');

    foreach ($students as $index => $studentData) {
    
        $existingStudent = Students::where('id_number', $studentData['id_number'])->first();
        if ($existingStudent) {
            return response()->json([
                'message' => 'Data validation failed',
                'errors' => ["Row $index: id_number " . $studentData['id_number'] . " telah digunakan oleh siswa lain."]
            ], 422);
        }

        try {
            $password = (string) $studentData['password'];

            $user = User::create([
                "username" => $studentData['username'],
                "password" => Hash::make($password),
                "email" => null, 
                "role" => "student",
                "status" => "inactive"
            ]);

            $idNumber = (string) $studentData['id_number'];
           
            $student = Students::create([
                "user_id" => $user->id,
                "name" => $studentData['username'],
                "address" => null,
                "phone_number" => null,
                "id_number" => $idNumber,
            ]);

            if (!$student) {
                return response()->json(["message" => "Row $index: Something went wrong while creating the student."], 500);
            }
        } catch (\Exception $e) {
            return response()->json(["message" => "Row $index: " . $e->getMessage()], 500);
        }
    }

    return response()->json(["message" => "Data imported successfully"], 201);
}

    public function update(Request $request, $id)
    {
        $validators = Validator::make($request->all(), [
            "username" => "required",
            "name" => "required",
            "password" => "required",
            "id_number" => "required|unique:students,id_number,{$id}",
        ]);

        if ($validators->fails()) {
            return response()->json([
                "status" => "error",
                "message" => "Validation failed",
                "errors" => $validators->errors()
            ], 400);
        }

        try {
            $student = Students::where("id", $id)->first();
            if (!$student) {
                return response()->json([
                    "status" => "error",
                    "message" => "Student not found"
                ], 404);
            }
            $user = User::where("id", $student->user_id)->first();

            // Update student
            $student->update([
                "name" => $request->name,
                "address" => $request->address,
                "phone_number" => $request->phone_number,
                "id_number" => $request->id_number,
            ]);

            // Update user
            $user->update([
                "username" => $request->username,
                "password" => Hash::make($request->password),
                "email" => $request->email,
                "role" => "student",
                "status" => $request->status ?? "inactive"
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Student updated successfully",
                "data" => [
                    "user" => $user,
                    "student" => $student
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while updating student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $student = Students::where("id", $id)->first();
            if (!$student) {
                return response()->json([
                    "status" => "error",
                    "message" => "Student not found"
                ], 404);
            }
            $user = User::where("id", $student->user_id)->first();

            // Delete student and user
            $student->delete();
            $user->delete();

            return response()->json([
                "status" => "success",
                "message" => "Student deleted successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while deleting student.",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
