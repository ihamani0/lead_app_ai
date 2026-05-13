<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\LlmModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LlmModelController extends Controller
{
    public function index()
    {
        $models = LlmModel::orderBy('name')->get();

        return Inertia::render('SuperAdmin/LlmModels/Index', [
            'models' => $models,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:llm_models,name',
            'display_name' => 'required|string|max:100',
            'provider' => 'required|string|max:50',
            'input_rate_cents' => 'required|integer|min:0',
            'output_rate_cents' => 'required|integer|min:0',
            'cost_input_cents' => 'required|integer|min:0',
            'cost_output_cents' => 'required|integer|min:0',
        ]);

        LlmModel::create($validated);

        return back()->with('success', 'Model created successfully.');
    }

    public function update(Request $request, LlmModel $llmModel)
    {
        $validated = $request->validate([
            'display_name' => 'sometimes|string|max:100',
            'provider' => 'sometimes|string|max:50',
            'input_rate_cents' => 'sometimes|integer|min:0',
            'output_rate_cents' => 'sometimes|integer|min:0',
            'cost_input_cents' => 'sometimes|integer|min:0',
            'cost_output_cents' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $llmModel->update($validated);

        return back()->with('success', 'Model updated successfully.');
    }

    public function destroy(LlmModel $llmModel)
    {
        $llmModel->delete();

        return back()->with('success', 'Model deleted successfully.');
    }
}
