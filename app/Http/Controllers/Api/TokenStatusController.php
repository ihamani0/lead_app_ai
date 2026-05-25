<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokenStatusController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $tenant = $user->tenant;

        return response()->json([
            'credit_millicents' => $tenant->credit_millicents,
            'is_low_credit' => $tenant->is_low_credit,
            'credit_in_dollars' => $tenant->credit_in_dollars,
        ]);
    }
}
