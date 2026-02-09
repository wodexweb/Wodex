<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    /**
     * Display a listing of all registrations with related users and payments.
     */
    public function index()
{
    return response()->json([
        'success' => true,
        'data' => Registration::with('payments')->latest()->get()
    ]);
}

public function show($id)
{
    $registration = Registration::with('payments')->findOrFail($id);

    return response()->json([
        'success' => true,
        'data' => $registration
    ]);
}

public function update(Request $request, $id)
{
    $user = Registration::findOrFail($id);

    $user->status = 'paid'; // safer than mass update
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Membership approved'
    ]);
}

public function destroy($id)
{
    $registration = Registration::findOrFail($id);

    $registration->payments()->delete();
    $registration->delete();

    return response()->json([
        'success' => true,
        'message' => 'Record removed'
    ]);
}
}