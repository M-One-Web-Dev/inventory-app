<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ActiveUser; 
use App\Models\User;

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

        $activeUser = ActiveUser::where('user_id', $user->id)->first();

        if (!$activeUser) {
            return response()->json([
                'status' => 'forbidden',
                'message' => 'User is not an active user.'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'success fetched',
            'data' => array_merge($activeUser->toArray(), ['role' => $user->role]) 
        ], 200); 
    }
}
