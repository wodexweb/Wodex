<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;

class MembershipPlanController extends Controller
{
    public function index()
    {
        return response()->json(MembershipPlan::orderBy('price', 'asc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_months' => 'required|integer|min:1',
            'benefits' => 'required|string',
            'status' => 'required|in:active,inactive',
        ]);

        return response()->json(MembershipPlan::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $plan = MembershipPlan::findOrFail($id);
        $plan->update($request->all());
        return response()->json($plan);
    }

    public function destroy($id)
    {
        MembershipPlan::findOrFail($id)->delete();
        return response()->json(['message' => 'Plan deleted']);
    }
}