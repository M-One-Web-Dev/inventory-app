<?php

namespace App\Http\Controllers;

use App\Models\ActiveUser;
use App\Models\Students;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class ActiveUserController extends Controller
{
 public function list()
    {
        try {
            $perPage = request()->query('perPage', 10); // Default 10 items per page
            $search = request()->query('search', '');   // Pencarian berdasarkan nama user
            $role = request()->query('role', '');       // Filter berdasarkan role

            // Query dengan filter bertumpuk berdasarkan search (nama) dan role
            $activeUsers = ActiveUser::with('user')
                ->when($role, function ($query, $role) {
                    return $query->whereHas('user', function ($query) use ($role) {
                        $query->where('role', $role);
                    });
                })
                ->when($search, function ($query, $search) {
                    return $query->whereHas('user', function ($query) use ($search) {
                        $query->where('username', 'like', "%{$search}%");
                    });
                })
                ->paginate($perPage);

            // Mapping hasil query ke format yang diinginkan
            $data = $activeUsers->getCollection()->map(function ($activeUser) {
                return [
                    "id" => $activeUser->id,
                    "username" => $activeUser->user->username,  // Mengambil username dari relasi user
                    "user_id" => $activeUser->user_id,
                    "user_from" => $activeUser->user_from,
                    "user_level" => $activeUser->user_level,
                    "school_year" => $activeUser->school_year,
                    "created_at" => $activeUser->created_at,
                    "updated_at" => $activeUser->updated_at,
                    "role" => $activeUser->user->role, // Mengambil role dari relasi user
                ];
            });

            // Set collection baru dengan data yang sudah di-mapping
            $activeUsers->setCollection($data);

            $totalPages = (int) ceil($activeUsers->total() / $activeUsers->perPage());

            // Response JSON dengan pagination
            return response()->json([
                "status" => "success",
                "message" => "Active users fetched successfully",
                "data" => $activeUsers->items(), // Data untuk halaman saat ini
                "pagination" => [
                    "total" => $activeUsers->total(),
                    "perPage" => $activeUsers->perPage(),
                    "currentPage" => $activeUsers->currentPage(),
                    "lastPage" => $activeUsers->lastPage(),
                    "totalPages" => $totalPages, 
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while fetching active users.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menambahkan active user baru.
     */
    public function add(Request $request)
    {
        // Validasi input
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string',
            'role' => 'required|string',
            'user_from' => 'nullable|string',
            'user_level' => 'nullable|string',
          
        ]);

        // Membuat user baru
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password), // Hash password
            'role' => $request->role,
            'status' => 'active', // Misalnya, status aktif
        ]);

        // Membuat active user baru
        $activeUser = ActiveUser::create([
            'user_id' => $user->id,
            'user_from' => $request->user_from,
            'user_level' => $request->user_level,
            'school_year' =>null,
        ]);

        return response()->json([
            "status" => "success",
            "message" => "Active student deleted successfully",
        ], 201); // Response 201 Created
    }

    /**
     * Menampilkan semua active users.
     */
    
    /**
     * Mengupdate data active user.
     */
public function update(Request $request)
{
    // Validasi input
    $request->validate([
        'id' => 'required|integer|exists:active_user,id',
        'username' => 'nullable|string|unique:users,username,' . $request->id . ',id', // Validasi username agar unik
        'user_from' => 'nullable|string',
        'user_level' => 'nullable|string',
        'school_year' => 'nullable|string',
    ]);

    // Menemukan active user berdasarkan ID yang ada di request body
    $activeUser = ActiveUser::findOrFail($request->id);

    // Memperbarui username di tabel user
    if ($request->filled('username')) {
        $user = $activeUser->user; // Mengambil data user yang berelasi dengan active user
        $user->username = $request->username;
        $user->save(); // Simpan perubahan di tabel user
    }

    // Memperbarui active user
    $activeUser->update($request->only(['user_from', 'user_level', 'school_year']));

    return response()->json([
        'status' => 'success',
        'message' => 'Active user updated successfully',
      
    ], 200); // Response 200 OK
}


    /**
     * Menghapus active user.
     */
   public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:active_user,id',
        ]);
       
        $activeUser = ActiveUser::findOrFail($request->id);
        $activeUser->delete();

        return response()->json(['status' => 'success','message' => 'Active user deleted successfully.'], 200); 
    }
}
