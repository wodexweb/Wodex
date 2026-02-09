<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /* ================= LIST ADMINS ================= */

    public function index()
    {
        return response()->json(
            Admin::orderByDesc('id')->get()
        );
    }

    /* ================= CREATE ADMIN ================= */

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:admin,email',
            'password' => 'required|min:6',
            'role_id'  => 'required|in:1,2,3',
        ]);

        $admin = Admin::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role_id'  => $request->role_id,
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin'   => $admin,
        ], 201);
    }

    /* ================= UPDATE ADMIN ================= */
    public function update(Request $request, $id)
    {
        $admin = Admin::findOrFail($id);
    
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'role_id' => 'required|integer',
            'password' => 'nullable|min:6',
        ]);
    
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
    
        $admin->update($data);
    
        return response()->json([
            'message' => 'Admin updated successfully'
        ]);
    }
    



    public function show($id)
{
    return response()->json(
        Admin::findOrFail($id)
    );
}

    /* ================= DELETE ADMIN ================= */

    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);

        $admin->delete();

        return response()->json([
            'message' => 'Admin deleted successfully',
        ]);
    }
}
