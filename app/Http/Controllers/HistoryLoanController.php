<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class HistoryLoanController extends Controller
{
    /**
     * Show the loan history for the currently authenticated user.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
       
        $userId = auth()->user()->id;
        $status = $request->query('status');
        $perPage = $request->query('per_page', 10);
        $query = Notification::with('item') 
            ->where('user_id', $userId);
        if ($status) {
            $query->where('status', $status);
        }

        
        $notifications = $query->paginate($perPage);

        $formattedNotifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'item_id' => $notification->item->id,
                'item_name' => $notification->item->name,
                'status' => $notification->status,
                'borrowed_at' => $notification->borrowed_at,
                'returned_at' => $notification->returned_at,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $formattedNotifications,
            'pagination' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'total_pages' => $notifications->lastPage(), 
            ],
        ]);
    }
}
