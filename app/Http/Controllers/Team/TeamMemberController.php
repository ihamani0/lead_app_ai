<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Services\TeamService;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    protected $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(Request $request) {}

    public function store(Request $request) {}

    public function show(Request $request, $id) {}

    public function update(Request $request, $id) {}

    public function destroy(Request $request, $id) {}
}
