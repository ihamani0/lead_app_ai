<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    /**
     * Show the billing and subscription page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('settings/billing');
    }
}
