<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Laravel\Paddle\Transaction;

class InvoiceController extends Controller
{
    public function download(Transaction $transaction): RedirectResponse
    {
        if (! config('services.paddle.enabled')) {
            abort(404);
        }

        return $transaction->redirectToInvoicePdf();
    }
}
