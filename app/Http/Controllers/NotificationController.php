<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Notification;
use App\Models\Items;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Show all notification.
     *
     * @return \Illuminate\Http\JsonResponse
     */
 public function index(Request $request)
{
    try {
        // Ambil parameter pagination dan search dari request
        $perPage = $request->query('perPage', 10); // Default 10 items per page
        $search = $request->query('search', ''); // Default empty search query

        // Dapatkan data notification dengan pagination dan search
        $notificationsQuery = Notification::with('item', 'user')
            ->when($search, function ($query, $search) {
                return $query->whereHas('user', function ($query) use ($search) {
                    $query->where('username', 'like', "%{$search}%");
                })->orWhereHas('item', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                });
            });

        $notifications = $notificationsQuery->paginate($perPage);

        // Transformasi data hanya pada items
        $data = $notifications->getCollection()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'item_id' => $notification->item->id,
                'item_name' => $notification->item->name,
                'user_id' => $notification->user->id,
                'user_name' => $notification->user->username,
                'status' => $notification->status,
                'borrowed_at' => $notification->borrowed_at,
                'returned_at' => $notification->returned_at,
            ];
        });

        // Set hasil transformasi kembali ke collection di paginator
        $notifications->setCollection($data);

        $totalPages = (int) ceil($notifications->total() / $notifications->perPage());

        return response()->json([
            'status' => 'success',
            'data' => $notifications->items(), // Data untuk halaman saat ini
            'pagination' => [
                'total' => $notifications->total(),
                'perPage' => $notifications->perPage(),
                'currentPage' => $notifications->currentPage(),
                'lastPage' => $notifications->lastPage(),
                  "totalPages" => $totalPages
                ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while fetching notifications.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    /**
     * handle borrow item
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
public function borrowItem(Request $request)
{
    $request->validate([
        'item_id' => 'required|exists:items,id',
        'user_id' => 'required|exists:users,id',
    ]);

    $item = Items::find($request->item_id);

    // Jika item tidak ditemukan
    if (!$item) {
        return response()->json(['message' => 'Item not found'], 404);
    }

   

    // Periksa apakah user sudah meminjam item tersebut
    $existingNotification = Notification::where('item_id', $request->item_id)
                                        ->where('user_id', $request->user_id)
                                        ->where('status', 'borrowed')
                                        ->exists();

    if ($existingNotification) {
        return response()->json(['message' => 'User has already borrowed this item'], 400);
    }

     // Jika item tidak tersedia untuk dipinjam
    if ($item->status !== 'available') {
        return response()->json(['message' => 'Item is not available for borrowing'], 400);
    }

    // Buat catatan notifikasi baru
    Notification::create([
        'item_id' => $request->item_id,
        'user_id' => $request->user_id,
        'status' => 'borrowed',
        'borrowed_at' => Carbon::now('Asia/Jakarta'),
    ]);

    // Perbarui status item menjadi 'not_available'
    $item->status = 'not_available';
    $item->save();

    return response()->json(['message' => 'Item borrowed successfully'], 200);
}


    /**
     * handle return item
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
public function returnItem(Request $request)
{
    $request->validate([
        'notification_id' => 'required|integer', 
        'status' => 'required|in:returned,borrowed',
    ]);

    $notificationId = $request->input('notification_id');

    $notification = Notification::find($notificationId);

    if (!$notification) {
        return response()->json(['message' => 'Notification not found'], 404);
    }

    $item = Items::find($notification->item_id);

    $isItemBorrowedByOtherUser = Notification::where('item_id', $notification->item_id)
                                             ->where('status', 'borrowed')
                                             ->where('user_id', '!=', $notification->user_id)
                                             ->exists();

    if ($request->status === 'borrowed' && ($item->status !== 'available' || $isItemBorrowedByOtherUser)) {
        return response()->json(['message' => 'Item is not available for borrowing'], 400);
    }

    
    $notification->update([
        'status' => $request->status,
        'returned_at' => ($request->status === 'returned') ? Carbon::now('Asia/Jakarta') : null,
    ]);

    
    if ($request->status === 'returned') {
        $item->status = 'available';
    } else if ($request->status === 'borrowed') {
        $item->status = 'not_available';
    }

    $item->save();

    return response()->json([
        'message' => 'Item status updated successfully',
        'notification' => $notification
    ], 200);
}




    public function delete($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $item = Items::find($notification->item_id);

        // Update item status to available if it's currently borrowed
        if ($notification->status === 'borrowed') {
            $item->status = 'available';
            $item->save();
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully'], 200);
    }
}
