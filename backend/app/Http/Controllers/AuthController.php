<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);
    
        $remember = $request->remember ?? false;
    
        // if ($remember) {
        //     config(['session.lifetime' => 43200]);  // 1 month
        // }
    
        if (!Auth::attempt($request->only('email', 'password'), $remember)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('SMS')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user)
        ]);
    }
    
    public function checkLoginStatus(Request $request)
    {
        $user = Auth::user();

        // if ($user && !$request->hasCookie('laravel_session')) {
        //     $request->user()->currentAccessToken()->delete();
        //     return response()->json(['status' => 'not_logged_in'], 401);
        // }

        if ($user) {
            return response()->json(['status' => 'logged_in', 'user' => new UserResource($user)]);
        }

        $request->user()->currentAccessToken()->delete();
        return response()->json(['status' => 'not_logged_in'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['status' => true, 'message' => 'Logged out']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password)
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }
}