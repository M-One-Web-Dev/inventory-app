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
        $perPage = $request->query('perPage', 10);
        $search = $request->query('search', '');

        $users = User::when($search, function ($query, $search) {
            return $query->where('username', 'like', "%{$search}%");
        })->paginate($perPage);

        $data = $users->getCollection()->map(function ($user) {
            $user_from = null;
            $user_level = null;

            switch ($user->role) {
                case 'admin':
                    $user_from = 'Admin';
                    $user_level = 'Admin';
                    break;

                case 'teacher':
                    $teacher = Teachers::where('user_id', $user->id)->first();
                    $user_from = $teacher->user_from ?? null;
                    $user_level = $teacher->user_level ?? null;
                    break;

                case 'student':
                    $student = Students::where('user_id', $user->id)->first();
                    if ($student) {
                        $activeStudent = ActiveStudents::where('student_id', $student->user_id)->first();
                        $user_from = $activeStudent->class ?? null;
                        $user_level = $activeStudent->generation ?? null;
                    }
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
            'data' => $users->items(), 
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
