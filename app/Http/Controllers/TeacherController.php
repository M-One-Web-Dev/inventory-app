<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Teachers;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teachers::all();
        return response()->json($teachers);
    }
}