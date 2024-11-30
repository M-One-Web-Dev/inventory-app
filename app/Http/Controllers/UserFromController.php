<?php

namespace App\Http\Controllers;

use App\Models\UserFrom;
use Illuminate\Http\Request;

class UserFromController extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->query('perPage', 10); 
            $search = $request->query('search', ''); 

            $search = is_string($search) ? $search : '';
            
            $levelsQuery = UserFrom::when($search !== '', function ($query) use ($search) {
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
                "message" => "An error occurred while fetching user from.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $request->validate([
            "name" => "required|unique:user_from,name",
        ]);

        $level = UserFrom::create([
            "name" => $request->name,
            "description" => $request->description,
        ]);

        if ($level) {
            return response()->json([
                "status" => "success",
                "message" => "Successfully created user from",
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
            "name" => "required|unique:user_from,name," . $id,
        ]);

        $level = UserFrom::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "User From not found"
            ], 404);
        }

        $level->update([
            "name" => $request->name,
            "description" => $request->description,
        ]);

        return response()->json([
            "status" => "success",
            "message" => "User From updated successfully",
            "data" => $level
        ]);
    }

    public function show($id)
    {
        $level = UserFrom::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "User From not found"
            ], 404);
        }

        return response()->json([
            "status" => "success",
            "data" => $level
        ]);
    }

    public function delete($id)
    {
        $level = UserFrom::find($id);

        if (!$level) {
            return response()->json([
                "status" => "error",
                "message" => "User From not found"
            ], 404);
        }

        $level->delete();

        return response()->json([
            "status" => "success",
            "message" => "User From deleted successfully"
        ]);
    }
}
