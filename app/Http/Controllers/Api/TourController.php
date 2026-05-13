<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TourProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TourController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $tours = TourProgress::forUser($request->user()->id)->get();

        return response()->json([
            'tours' => $tours->map(fn ($tour) => [
                'tour_name' => $tour->tour_name,
                'completed' => $tour->completed,
                'completed_steps' => $tour->completed_steps,
                'skipped_at' => $tour->skipped_at,
            ]),
        ]);
    }

    public function completeStep(Request $request, string $tourName): JsonResponse
    {
        $request->validate([
            'step_id' => 'required|string',
        ]);
        $tour = TourProgress::firstOrCreate(
            ['user_id' => $request->user()->id, 'tour_name' => $tourName],
            ['completed' => false, 'completed_steps' => []]
        );

        $steps = $tour->completed_steps ?? [];

        if (! in_array($request->step_id, $steps)) {
            $steps[] = $request->step_id;
            $tour->update(['completed_steps' => $steps]);
        }

        return response()->json(['success' => true]);
    }

    public function complete(Request $request, string $tourName): JsonResponse
    {
        $tour = TourProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'tour_name' => $tourName],
            ['completed' => true, 'skipped_at' => null]
        );

        return response()->json(['success' => true]);
    }

    public function skip(Request $request, string $tourName): JsonResponse
    {
        $tour = TourProgress::updateOrCreate(
            ['user_id' => $request->user()->id, 'tour_name' => $tourName],
            ['completed' => false, 'skipped_at' => now()]
        );

        return response()->json(['success' => true]);
    }

    public function reset(Request $request, string $tourName): JsonResponse
    {
        TourProgress::forUser($request->user()->id)
            ->forTour($tourName)
            ->delete();

        return response()->json(['success' => true]);
    }
}
