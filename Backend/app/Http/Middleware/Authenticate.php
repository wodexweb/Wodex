<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\JsonResponse;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        // API requests (AJAX/JSON) - return JSON error instead of redirect
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Web requests - redirect to login
        return route('login');
    }

    /**
     * Handle unauthenticated API requests with JSON response
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'message' => 'Unauthenticated.',
                'status' => 401
            ], 401));
        }

        parent::unauthenticated($request, $guards);
    }
}
