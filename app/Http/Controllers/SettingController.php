<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;

class SettingController extends Controller
{
        public function index()
    {
        $setting = Settings::first();

        if (!$setting) {
            return response()->json([
                'message' => 'No settings found.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'message' => 'Settings retrieved successfully.',
            'data' => $setting,
        ]);
    }
    public function updateSchoolYear(Request $request)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|max:255',
        ]);

        $setting = Settings::first();

        if (!$setting) {
            $setting = new Settings();
        }

        $setting->school_year = $validated['school_year'];
        $setting->save();

        return response()->json([
            'message' => 'School year updated successfully.',
            'data' => $setting,
        ]);
    }
}
