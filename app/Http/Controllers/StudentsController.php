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
            $students = Students::all();

            // Format data for response
            $data = $students->map(function ($student) {
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

            return response()->json([
                "status" => "success",
                "message" => "Students fetched successfully",
                "data" => $data
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
            "id_number" => "required",
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
                "email" => $request->email,
                "role" => "student",
                "status" => $request->status ?? "inactive"
            ]);

            $student = Students::create([
                "user_id" => $user->id,
                "name" => $request->name,
                "address" => $request->address,
                "phone_number" => $request->phone_number,
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

    public function update(Request $request, $id)
    {
        $validators = Validator::make($request->all(), [
            "username" => "required",
            "name" => "required",
            "password" => "required",
            "id_number" => "required",
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
