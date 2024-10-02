<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Items; 
use App\Models\HistoryBorrowedItem;
use Illuminate\Support\Facades\Validator;

class HistoryBorrowedItemController extends Controller
{
public function index()
{
    try {
        $perPage = request()->query('perPage', 10);
        $search = request()->query('search', '');
        $userId = request()->query('user_id', null);  
        $itemId = request()->query('item_id', null);  
        $type = request()->query('type', null); 

        $historyBorrowedItems = HistoryBorrowedItem::with(['user', 'item'])
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($q) use ($search) {
                        $q->where('username', 'like', "%{$search}%");
                    })->orWhereHas('item', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
                });
            })
            ->when($userId, function ($query, $userId) {
                return $query->where('user_id', $userId);  // Filter berdasarkan user_id
            })
            ->when($itemId, function ($query, $itemId) {
                return $query->where('item_id', $itemId);  // Filter berdasarkan item_id
            })
            ->when($type, function ($query, $type) {
                return $query->where('type', $type);  // Filter berdasarkan type
            })
            ->paginate($perPage);

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
                'type' => $item->type,  // Tambahkan field type di response
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
    // Validasi input
    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'item_id' => 'required|exists:items,id',
        'borrowed_user_from' => 'nullable|string',
        'borrowed_level' => 'nullable|string',
        'type' => 'required|in:automation,manual',
    ]);

    // Jika validasi gagal
    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation error.',
            'errors' => $validator->errors()
        ], 400);
    }

    // Cek apakah item saat ini sudah dipinjam oleh pengguna lain
    $isCurrentlyBorrowed = HistoryBorrowedItem::where('item_id', $request->item_id)
        ->where('status', 'borrowed')
        ->exists();

    // Jika item sudah dipinjam
    if ($isCurrentlyBorrowed) {
        return response()->json([
            'status' => 'info',
            'message' => 'This item is currently borrowed by another user.'
        ], 200);
    }

    // Buat riwayat peminjaman baru
    $historyBorrowedItem = HistoryBorrowedItem::create([
        'user_id' => $request->user_id,
        'item_id' => $request->item_id,
        'borrowed_user_from' => $request->borrowed_user_from,
        'borrowed_level' => $request->borrowed_level,
        'status' => 'borrowed',
        'type' => $request->type,
        'borrowed_at' => Carbon::now('Asia/Jakarta')
    ]);

    // Ubah status item menjadi "not_available"
    $item = Items::find($request->item_id);
    $item->status = 'not_available';
    $item->save(); // Simpan perubahan status item

    return response()->json([
        'status' => 'success',
        'message' => 'History borrowed item successfully created and item status updated to not available.',
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
        // Validasi input
        $request->validate([
            'id' => 'required|integer|exists:history_borrowed_items,id',
            'status' => 'required|in:borrowed,returned',
        ]);

        // Ambil data history peminjaman berdasarkan ID
        $historyBorrowedItem = HistoryBorrowedItem::findOrFail($request->input('id'));

        // Ambil item yang dipinjam
        $item = $historyBorrowedItem->item;

        // Jika status diubah menjadi 'borrowed'
        if ($request->input('status') === 'borrowed') {
            // Cek apakah item sedang dipinjam oleh orang lain
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

            // Atur waktu peminjaman ulang dan ubah status item menjadi 'not_available'
            $historyBorrowedItem->returned_at = null;
            $item->status = 'not_available';
        }

        // Update status peminjaman
        $historyBorrowedItem->status = $request->input('status');

        // Jika status diubah menjadi 'returned'
        if ($request->input('status') === 'returned') {
            $historyBorrowedItem->returned_at = Carbon::now('Asia/Jakarta');
            $item->status = 'available'; // Ubah status item menjadi 'available' ketika dikembalikan
        }

        // Simpan perubahan status peminjaman
        $historyBorrowedItem->save();

        // Simpan perubahan status item
        $item->save();

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
                'item_status' => $item->status, // Sertakan status item dalam respons
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
    try {
        $historyBorrowedItem = HistoryBorrowedItem::find($id);

        if (!$historyBorrowedItem) {
            return response()->json(['message' => 'History borrowed item not found'], 404);
        }

        $item = $historyBorrowedItem->item;

        if ($historyBorrowedItem->status === 'borrowed') {
            $item->status = 'available';
            $item->save(); 
        }

        $historyBorrowedItem->delete();

        return response()->json(['message' => 'History borrowed item successfully deleted'], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while deleting the history borrowed item.',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
