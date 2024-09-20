<?php

namespace App\Http\Controllers;

use App\Models\Temporary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TemporaryController extends Controller
{
public function availableDates()
{
    try {
        $dates = Temporary::selectRaw('DATE(created_at) as date')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            "status" => "success",
            "message" => "Available dates fetched successfully",
            "data" => $dates,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching dates.",
            "error" => $e->getMessage()
        ], 500);
    }
}


public function index()
{
    try {
        $perPage = request()->query('perPage', 10); // Default 10 items per page
        $search = request()->query('search', '');
        
        // Filtering based on search query
        $temporaries = Temporary::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                         ->orWhere('item_name', 'like', "%{$search}%");
        })->paginate($perPage);

        // Calculating total pages
        $totalPages = (int) ceil($temporaries->total() / $temporaries->perPage());

        return response()->json([
            "status" => "success",
            "message" => "Temporaries fetched successfully",
            "data" => $temporaries->items(),  
            "pagination" => [
                "total" => $temporaries->total(),
                "perPage" => $temporaries->perPage(),
                "currentPage" => $temporaries->currentPage(),
                "lastPage" => $temporaries->lastPage(),
                "totalPages" => $totalPages,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching temporaries.",
            "error" => $e->getMessage()
        ], 500);
    }
}

  public function updateStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:temporary,id',
            'status' => 'required|boolean',
        ]);

        $temporary = Temporary::find($request->id);

        if ($temporary) {
            $temporary->status = $request->status === true ? 0 : 1;
            $temporary->save();

            return response()->json([
                'message' => 'Status updated successfully.',
                'data' => $temporary
            ], 200);
        }

        return response()->json([
            'message' => 'Record not found.'
        ], 404);
    }

public function exportData()
{
    try {
        $date = request()->query('date');

        $temporaries = Temporary::when($date, function ($query, $date) {
            return $query->whereDate('created_at', $date);
        })->get(); 

        return response()->json([
            "status" => "success",
            "message" => "Temporaries fetched successfully",
            "data" => $temporaries,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching temporaries.",
            "error" => $e->getMessage()
        ], 500);
    }
}


    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'number_id' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'student_class' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'item_name' => 'required|string|max:255',
            'item_id' => 'required|string|max:255',
            'item_number_id' => 'required|string|max:255',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "message" => "Validation error",
                "errors" => $validator->errors()
            ], 422);
        }

        try {
            $temporary = Temporary::create($request->all());

            return response()->json([
                "status" => "success",
                "message" => "Temporary created successfully",
                "data" => $temporary
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while creating the temporary.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $temporary = Temporary::findOrFail($id);

            return response()->json([
                "status" => "success",
                "message" => "Temporary fetched successfully",
                "data" => $temporary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while fetching the temporary.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'number_id' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'student_class' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|string|max:255',
            'item_name' => 'sometimes|required|string|max:255',
            'item_id' => 'sometimes|required|string|max:255',
            'item_number_id' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => "error",
                "message" => "Validation error",
                "errors" => $validator->errors()
            ], 422);
        }

        try {
            $temporary = Temporary::findOrFail($id);
            $temporary->update($request->all());

            return response()->json([
                "status" => "success",
                "message" => "Temporary updated successfully",
                "data" => $temporary
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while updating the temporary.",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $temporary = Temporary::findOrFail($id);
            $temporary->delete();

            return response()->json([
                "status" => "success",
                "message" => "Temporary deleted successfully"
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "An error occurred while deleting the temporary.",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
