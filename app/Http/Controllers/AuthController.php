<?php

namespace App\Http\Controllers;

use App\Models\ActiveStudents;
use App\Models\Students;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * Class AuthController
 * @package App\Http\Controllers
 *
 * Controller for handling user authentication and registration.
 */
class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            "id_number" => "required|integer",
            "address" => "required|string",
            "phone_number" => "required|string",
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

      
        $cek = Students::where("id_number", $request->id_number)->first();
        if ($cek) {
            return response()->json([
                "status" => "error",
                "message" => "ID number already exists"
            ], 422);
        }

       
        $user = User::create([
            "username" => $request->username,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "role" => "student",
        ]);
        if ($user) {
         
            $student = Students::create([
                "id_number" => $request->id_number,
                "address" => $request->address,
                "phone_number" => $request->phone_number,
                "name" => $request->username,
                "user_id" => $user->id,
            ]);

           
            $currentYear = date('Y');
            $nextYear = $currentYear + 1;
            $schoolYear = $currentYear . "/" . $nextYear;

            $activeStudent = ActiveStudents::create([
                "student_id" => $student->id,
                "class" => $request->class,
                "generation" => $request->generation,
                "school_year" => $schoolYear
            ]);

           
            if ($activeStudent) {
                return response()->json([
                    "status" => "success",
                    "message" => "Registration successful"
                ]);
            }
        }

        return response()->json([
            "status" => "error",
            "message" => "Registration failed"
        ], 422);
    }

    /**
     * Handle the login request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
public function login(Request $request)
{
    // Validasi input request
    $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // Ambil kredensial yang diperlukan
    $credentials = $request->only('username', 'password');

    // Cari user berdasarkan username
    $user = User::where('username', $request->username)->first();

    if (!$user) {
        // Error handler ketika username tidak ditemukan
        return response()->json(['status' => 'unauthorized','message' => 'Username or password is incorrect'], 401);
    }

    // Error handler ketika user tidak aktif
    if ($user->status !== 'active') {
        return response()->json(['status' => 'forbidden','message' => 'User is not active'], 403);
    }

    // Cek apakah kredensial cocok menggunakan Auth::attempt
    if (Auth::attempt($credentials)) {
        // Jika login berhasil
        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ], 200);
    } else {
        // Error handler ketika password salah
        return response()->json(['status' => 'unauthorized','message' => 'Username or password is in'], 401);
    }
}

}
