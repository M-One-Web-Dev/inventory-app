<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Http\Request;

class LevelController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('perPage', 10); 
            $search = $request->query('search', ''); 

            $search = is_string($search) ? $search : '';
            
            $levelsQuery = Level::when($search !== '', function ($query) use ($search) {
                return $query->where('name', 'like', "%{$search}%");
            });

            $levels = $levelsQuery->paginate($perPage);
            $totalPages = (int) ceil($levels->total() / $levels->perPage());

            return response()->json([
                "status" => "success",
                "data" => $levels->items(),  
                "pagination" => [
                    "total" => $levels->total(),
                    "perPage" => $levels->perPage(),
                    "currentPage" => $levels->currentPage(),
                    "lastPage" => $levels->lastPage(),
                    "totalPages" => $totalPages,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while fetching levels.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $request->validate([
            "name" => "required|unique:levels,name",
        ]);

        $level = Level::create([
            "name" => $request->name,
            "description" => $request->description,
        ]);

        if ($level) {
            return response()->json([
                "status" => "success",
                "message" => "Successfully created level",
                "data" => $level
            ], 201);
        }

        return response()->json([
            "status" => "error",
            "message" => "Something went wrong"
        ], 500);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            "name" => "required|unique:levels,name," . $id,
        ]);

        $level = Level::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "Level not found"
            ], 404);
        }

        $level->update([
            "name" => $request->name,
            "description" => $request->description,
        ]);

        return response()->json([
            "status" => "success",
            "message" => "Level updated successfully",
            "data" => $level
        ]);
    }

    public function show($id)
    {
        $level = Level::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "Level not found"
            ], 404);
        }

        return response()->json([
            "status" => "success",
            "data" => $level
        ]);
    }

    public function delete($id)
    {
        $level = Level::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "Level not found"
            ], 404);
        }

        $level->delete();

        return response()->json([
            "status" => "success",
            "message" => "Level deleted successfully"
        ]);
    }
}
