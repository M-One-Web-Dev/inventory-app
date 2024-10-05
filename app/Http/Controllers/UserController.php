<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Teachers;
use App\Models\Students;
use App\Models\ActiveStudents;

class UserController extends Controller
{
    /**
     * Display a listing of usernames with pagination and search.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
public function listUsernames(Request $request)
{
    try {
        $perPage = $request->query('perPage', 10); // Default 10 items per page
        $search = $request->query('search', '');

        // Query untuk mengambil username dengan pencarian dan pagination
        $users = User::when($search, function ($query, $search) {
            return $query->where('username', 'like', "%{$search}%");
        })->paginate($perPage);

        // Format data untuk response
        $data = $users->getCollection()->map(function ($user) {
            $user_from = null;
            $user_level = null;

            switch ($user->role) {
                case 'admin':
                    // Admin: return predefined values
                    $user_from = 'Admin';
                    $user_level = 'Admin';
                    break;

                case 'teacher':
                    // Teacher: get data from teachers table, or return null if not found
                    $teacher = Teachers::where('user_id', $user->id)->first();
                    $user_from = $teacher->user_from ?? null;
                    $user_level = $teacher->user_level ?? null;
                    break;

                case 'student':
                    // Student: get data from students table first
                    $student = Students::where('user_id', $user->id)->first();
                    if ($student) {
                        // Find related data from active_students using number_id from students table
                        $activeStudent = ActiveStudents::where('student_id', $student->user_id)->first();
                        $user_from = $activeStudent->class ?? null; // Ambil dari data 'class'
                        $user_level = $activeStudent->generation ?? null; // Ambil dari data 'generation'
                    }
                    break;

                case 'staff':
                    // Staff: Table and logic belum dibuat
                    // Return user_from and user_level as null for now
                    $user_from = null;
                    $user_level = null;
                    break;
            }

            return [
                'id' => $user->id,
                'username' => $user->username,
                'role' => $user->role,
                'user_from' => $user_from,
                'user_level' => $user_level,
            ];
        });

        $users->setCollection($data);

        $totalPages = (int) ceil($users->total() / $users->perPage());

        return response()->json([
            'status' => 'success',
            'message' => 'Usernames fetched successfully',
            'data' => $users->items(), // Data untuk halaman saat ini
            'pagination' => [
                'total' => $users->total(),
                'perPage' => $users->perPage(),
                'currentPage' => $users->currentPage(),
                'lastPage' => $users->lastPage(),
                'totalPages' => $totalPages,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while fetching usernames.',
            'error' => $e->getMessage()
        ], 500);
    }
}


}
