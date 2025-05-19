<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;

class UserModuleAccessController extends Controller
{
    public function index()
    {
        $modules = Module::with('children')->whereNull('parent_id')->get();

        return response()->json($modules);
    }

    public function getUserAccess($userId)
    {
        $user = User::findOrFail($userId);
        return response()->json(['module_access' => $user->module_access ?? '{}']);
    }

    public function saveAccess(Request $request, $userId)
    {
        $validated = $request->validate([
            'module_access' => 'required|json',
        ]);
    
        $user = User::findOrFail($userId);
        $user->module_access = $validated['module_access'];
        $user->save();
    
        return response()->json(['message' => 'Access saved successfully.']);
    }    
}