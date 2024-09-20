<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role' => $user->role,
                    
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
