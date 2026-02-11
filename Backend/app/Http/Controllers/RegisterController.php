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
  public function approve($id)
{
    $registration = Registration::findOrFail($id);
    $registration->status = 'paid';
    $registration->save();

    return response()->json([
        'success' => true,
        'message' => 'Membership approved'
    ]);
}
public function update(Request $request, $id)
{
    $registration = Registration::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
        'surname' => 'required|string|max:255',
        'email' => 'required|email',
        'mobile' => 'required|string|max:20',
        'city' => 'required|string|max:255',
        'status' => 'required|in:pending,paid',
    ]);

    $registration->update($request->only([
        'name',
        'surname',
        'email',
        'mobile',
        'city',
        'status',
    ]));

    return response()->json([
        'success' => true,
        'message' => 'User updated successfully'
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