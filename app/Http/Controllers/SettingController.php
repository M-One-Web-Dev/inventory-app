<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;

class SettingController extends Controller
{
        public function index()
    {
        // Ambil entri pertama dari tabel settings
        $setting = Settings::first();

        // Jika tidak ada data, kembalikan respons default
        if (!$setting) {
            return response()->json([
                'message' => 'No settings found.',
                'data' => null,
            ], 404);
        }

        // Kembalikan data setting
        return response()->json([
            'message' => 'Settings retrieved successfully.',
            'data' => $setting,
        ]);
    }
    public function updateSchoolYear(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'school_year' => 'required|string|max:255',
        ]);

        // Ambil entri pertama di tabel settings
        $setting = Settings::first();

        // Jika belum ada data, buat baru
        if (!$setting) {
            $setting = new Settings();
        }

        // Update school_year
        $setting->school_year = $validated['school_year'];
        $setting->save();

        // Response
        return response()->json([
            'message' => 'School year updated successfully.',
            'data' => $setting,
        ]);
    }
}
