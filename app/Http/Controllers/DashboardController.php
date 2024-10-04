<?php

namespace App\Http\Controllers;

use App\Models\Students;
use App\Models\Teachers;
use App\Models\ActiveStudents;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStudents = Students::count();
        $totalTeachers = Teachers::count();
        $totalActiveStudents = ActiveStudents::count();

        return response()->json([
            'status' => "success",
            'message' => "Successfully get dashboard data",
            'data' => [
'total_students' => $totalStudents,
            'total_teachers' => $totalTeachers,
            'total_active_students' => $totalActiveStudents,
            ],
            
        ]);
    }
}
