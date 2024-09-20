<?php

namespace App\Http\Controllers;

use App\Models\Teachers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
   public function index(Request $request)
{
    try {
        $perPage = $request->query('perPage', 10);
        $search = $request->query('search', '');

        $teachers = Teachers::when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                             ->orWhere('id_number', 'like', "%{$search}%");
            })
            ->paginate($perPage);

        $data = $teachers->getCollection()->map(function ($teacher) {
            return [
                'id' => $teacher->id,
                'user_id' => $teacher->user_id,
                'id_number' => $teacher->id_number,
                'name' => $teacher->name,
                'created_at' => $teacher->created_at,
                'updated_at' => $teacher->updated_at,
                'image' => $teacher->image,
            ];
        });

        $teachers->setCollection($data);
        $totalPages = (int) ceil($teachers->total() / $teachers->perPage());

        return response()->json([
            "status" => "success",
            "message" => "Teachers fetched successfully",
            "data" => $teachers->items(), 
            "pagination" => [
                "total" => $teachers->total(),
                "perPage" => $teachers->perPage(),
                "currentPage" => $teachers->currentPage(),
                "lastPage" => $teachers->lastPage(),
                 "totalPages" => $totalPages,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching teachers.",
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
            // Mengubah pesan error menjadi lebih informatif
            $errors = [];
            foreach ($validators->errors()->getMessages() as $field => $message) {
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

        $teachers = $request->input('data');

        foreach ($teachers as $index => $teacherData) {

            $existingTeacher = Teachers::where('id_number', $teacherData['id_number'])->first();
            if ($existingTeacher) {
                return response()->json([
                    'message' => 'Data validation failed',
                    'errors' => ["Row $index: id_number " . $teacherData['id_number'] . " telah digunakan oleh guru lain."]
                ], 422);
            }

            try {

                $password = (string) $teacherData['password'];

                $user = User::create([
                    "username" => $teacherData['username'],
                    "password" => Hash::make($password),
                    "email" => null,
                    "role" => "teacher",
                    "status" => "active"
                ]);

                $idNumber = (string) $teacherData['id_number'];

                $teacher = Teachers::create([
                    "user_id" => $user->id,
                    "name" => $teacherData['username'],
                    "id_number" => $idNumber,
                ]);

                if (!$teacher) {
                    return response()->json(["message" => "Row $index: Something went wrong while creating the teacher."], 500);
                }
            } catch (\Exception $e) {
                return response()->json(["message" => "Row $index: " . $e->getMessage()], 500);
            }
        }

        return response()->json(["message" => "Data imported successfully"], 201);
    }
    public function create(Request $request)
    {
        $request->validate([
            "id_number" => "required",
            "name" => "required",
            // "status" => "required",
            // "username" => "required",
            "password" => "required",
            // "email" => "nullable|email",
            // "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048"
        ]);

        try {
            $user = User::create([
                "username" => $request->name,
                "password" => Hash::make($request->password),
                "role" => "teacher",
                "status" => "active",
                "email" => null,
            ]);

            $imageName = "";
            if ($request->hasFile('image')) {
                $rand = Str::random(8);
                $fileName = $rand . "-" . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('public/upload/teacher', $fileName);
                $imageName = $fileName;
            }

            $teacher = Teachers::create([
                "id_number" => $request->id_number,
                "name" => $request->name,
                "user_id" => $user->id,
                "image" => null,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Teacher created successfully",
                "data" => $teacher
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while creating the teacher.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            "id_number" => "required",
            "name" => "required",
            "image" => "nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048"
        ]);

        try {
            $teacher = Teachers::findOrFail($id);

            if ($request->hasFile('image')) {
                if ($teacher->image && Storage::exists('public/upload/teacher/' . $teacher->image)) {
                    Storage::delete('public/upload/teacher/' . $teacher->image);
                }

                $rand = Str::random(8);
                $fileName = $rand . "-" . $request->file('image')->getClientOriginalName();
                $request->file('image')->storeAs('public/upload/teacher', $fileName);
                $teacher->image = $fileName;
            }

            $teacher->update([
                "id_number" => $request->id_number,
                "name" => $request->name,
                "image" => $teacher->image,
            ]);

            return response()->json([
                "status" => "success",
                "message" => "Teacher updated successfully",
                "data" => $teacher
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while updating the teacher.",
                "error" => $e->getMessage()
            ], 500);
        }
    }


    public function delete($id)
    {
        try {
            $teacher = Teachers::findOrFail($id);
            $user = User::findOrFail($teacher->user_id);

            if ($teacher->image && Storage::exists('public/upload/teacher/' . $teacher->image)) {
                Storage::delete('public/upload/teacher/' . $teacher->image);
            }

            $teacher->delete();
            $user->delete();

            return response()->json([
                "status" => "success",
                "message" => "Teacher deleted successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while deleting the teacher.",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
