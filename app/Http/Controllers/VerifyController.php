<?php

namespace App\Http\Controllers;

use App\Models\ActiveStudents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActiveUser; 
use App\Models\User;
use App\Models\Students;
use App\Models\Teachers;

class VerifyController extends Controller
{
    public function verify(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'unauthorized',
                'message' => 'Token is invalid or expired.'
            ], 401); 
        }

        $user = Auth::user();

        if (!$user->status) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'User is not active.'
            ], 403);
        }

        $responseData = [
            'id' => $user->id,
            'username' => $user->username, 
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
        ];

        if ($user->role == 'student') {
            $student = Students::where('user_id', $user->id)->first();
            if ($student) {
                $activeStudent = ActiveStudents::where('student_id', $student->id)->first();
                if ($activeStudent) {
                    $responseData = [
                        'user_id' => $user->id,
                        'username' => $user->username, 
                        'user_from' => $activeStudent->class, 
                        'user_level' => $activeStudent->generation,
                        'role' => 'student'
                    ];
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Active student details not found.'
                    ], 404);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Student not found.'
                ], 404);
            }
        } elseif ($user->role == 'teacher') {
            $teacher = Teachers::where('user_id', $user->id)->first();
            if ($teacher) {
                $userFrom = $teacher->class ?? null; 
                $userLevel = $teacher->subject ?? null; 
                $responseData = [
                    'user_id' => $user->id,
                    'username' => $user->username, 
                    'user_from' => $userFrom, 
                    'user_level' => $userLevel, 
                    'role' => 'teacher'
                ];
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Teacher details not found.'
                ], 404);
            }
        } elseif ($user->role == 'admin') {
            $responseData = [
                'user_id' => $user->id,
                'username' => $user->username, 
                'user_from' => 'Admin',
                'user_level' => 'Admin',
                'role' => 'admin'
            ];
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully fetched user details.',
            'data' => $responseData
        ], 200);
    }
}
