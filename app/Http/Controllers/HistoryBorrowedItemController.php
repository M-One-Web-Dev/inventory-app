<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HistoryBorrowedItem;
use Illuminate\Support\Facades\Validator;

class HistoryBorrowedItemController extends Controller
{
public function index()
{
    try {
        $perPage = request()->query('perPage', 10);
        $search = request()->query('search', '');
        
        $historyBorrowedItems = HistoryBorrowedItem::with(['user', 'item'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('user', function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%");
                })->orWhereHas('item', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })->paginate($perPage);

        $formattedItems = $historyBorrowedItems->map(function ($item) {
            return [
                'id' => $item->id,
                'username' => $item->user->username,
                'user_id' => $item->user->id,
                'item_name' => $item->item->name,
                "item_id" => $item->item->id,
                'borrowed_user_from' => $item->borrowed_user_from,
                'borrowed_level' => $item->borrowed_level,
                'status' => $item->status,
                'borrowed_at' => $item->borrowed_at,
                'returned_at' => $item->returned_at,
            ];
        });

        $totalPages = (int) ceil($historyBorrowedItems->total() / $historyBorrowedItems->perPage());

        return response()->json([
            "status" => "success",
            "message" => "History borrowed items fetched successfully",
            "data" => $formattedItems, 
            "pagination" => [
                "total" => $historyBorrowedItems->total(),
                "perPage" => $historyBorrowedItems->perPage(),
                "currentPage" => $historyBorrowedItems->currentPage(),
                "lastPage" => $historyBorrowedItems->lastPage(),
                "totalPages" => $totalPages,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while fetching history borrowed items.",
            "error" => $e->getMessage()
        ], 500);
    }
}

public function create(Request $request)
{
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'item_id' => 'required|exists:items,id',
        'borrowed_user_from' => 'nullable|string',
        'borrowed_level' => 'nullable|string',
        'type' => 'required|in:automation,manual',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation error.',
            'errors' => $validator->errors()
        ], 400);
    }

    $isCurrentlyBorrowed = HistoryBorrowedItem::where('item_id', $request->item_id)
        ->where('status', 'borrowed')
        ->exists();

    if ($isCurrentlyBorrowed) {
        return response()->json([
            'status' => 'info',
            'message' => 'This item is currently borrowed by another user.'
        ], 200);
    }

    $historyBorrowedItem = HistoryBorrowedItem::create([
        'user_id' => $request->user_id,
        'item_id' => $request->item_id,
        'borrowed_user_from' => $request->borrowed_user_from,
        'borrowed_level' => $request->borrowed_level,
        'status' => 'borrowed',
        'type' => $request->type,
        'borrowed_at' => Carbon::now('Asia/Jakarta')
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'History borrowed item successfully created.',
        'data' => $historyBorrowedItem
    ], 201);
}

    public function show($id)
    {
        $historyBorrowedItem = HistoryBorrowedItem::with(['user', 'item'])->find($id);

        if (!$historyBorrowedItem) {
            return response()->json(['message' => 'History borrowed item not found'], 404);
        }

        return response()->json($historyBorrowedItem, 200);
    }

   public function update(Request $request, $id)
{
    $historyBorrowedItem = HistoryBorrowedItem::find($id);

    if (!$historyBorrowedItem) {
        return response()->json(['message' => 'History borrowed item not found'], 404);
    }

    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'item_id' => 'required|exists:items,id',
        'borrowed_user_from' => 'nullable|string',
        'borrowed_level' => 'nullable|string',
        'type' => 'required|in:automation,manual',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 400);
    }

    $historyBorrowedItem->update([
        'user_id' => $request->user_id,
        'item_id' => $request->item_id,
        'borrowed_user_from' => $request->borrowed_user_from,
        'borrowed_level' => $request->borrowed_level,
        'type' => $request->type,
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'History borrowed item successfully updated.',
        'data' => $historyBorrowedItem
    ], 200);
}


public function editStatus(Request $request)
{
    try {
        $request->validate([
            'id' => 'required|integer|exists:history_borrowed_items,id',
            'status' => 'required|in:borrowed,returned',
        ]);

        $historyBorrowedItem = HistoryBorrowedItem::findOrFail($request->input('id'));

        if ($request->input('status') === 'borrowed') {
            $isCurrentlyBorrowed = HistoryBorrowedItem::where('item_id', $historyBorrowedItem->item_id)
                ->where('status', 'borrowed')
                ->where('id', '!=', $historyBorrowedItem->id) 
                ->exists();

            if ($isCurrentlyBorrowed) {
                return response()->json([
                    "status" => "info",
                    "message" => "This item is currently borrowed by another user.",
                    "data" => [
                        'id' => $historyBorrowedItem->id,
                        'username' => $historyBorrowedItem->user->username,
                        'item_name' => $historyBorrowedItem->item->name,
                        'borrowed_user_from' => $historyBorrowedItem->borrowed_user_from,
                        'borrowed_level' => $historyBorrowedItem->borrowed_level,
                        'status' => $historyBorrowedItem->status,
                        'borrowed_at' => $historyBorrowedItem->borrowed_at,
                        'returned_at' => $historyBorrowedItem->returned_at,
                    ],
                ]);
            }
            $historyBorrowedItem->returned_at = null;
        }
        $historyBorrowedItem->status = $request->input('status');

        if ($request->input('status') === 'returned') {
            $historyBorrowedItem->returned_at = now();
        }

        $historyBorrowedItem->save();

        return response()->json([
            "status" => "success",
            "message" => "Status updated successfully",
            "data" => [
                'id' => $historyBorrowedItem->id,
                'username' => $historyBorrowedItem->user->username,
                'item_name' => $historyBorrowedItem->item->name,
                'borrowed_user_from' => $historyBorrowedItem->borrowed_user_from,
                'borrowed_level' => $historyBorrowedItem->borrowed_level,
                'status' => $historyBorrowedItem->status,
                'borrowed_at' => $historyBorrowedItem->borrowed_at,
                'returned_at' => $historyBorrowedItem->returned_at,
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            "status" => "error",
            "message" => "An error occurred while updating status.",
            "error" => $e->getMessage()
        ], 500);
    }
}

    public function delete($id)
    {
        $historyBorrowedItem = HistoryBorrowedItem::find($id);

        if (!$historyBorrowedItem) {
            return response()->json(['message' => 'History borrowed item not found'], 404);
        }

        $historyBorrowedItem->delete();

        return response()->json(['message' => 'History borrowed item successfully deleted'], 200);
    }
}
