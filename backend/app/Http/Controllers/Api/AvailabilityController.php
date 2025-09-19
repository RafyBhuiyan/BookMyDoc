<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Support\EnsuresRole;

class AvailabilityController extends Controller
{
    use EnsuresRole;

    public function index(Request $r){
        $this->ensureDoctor($r);
        return Availability::where('doctor_id', $r->user()->id)->latest('date')->get();
    }

    public function store(Request $r){
        $this->ensureDoctor($r);
        $data = $r->validate([
            'date'         => ['required','date'],
            'start_time'   => ['required','date_format:H:i'],
            'end_time'     => ['required','date_format:H:i','after:start_time'],
            'slot_minutes' => ['nullable','integer','min:10','max:120'],
        ]);
        $data['doctor_id'] = $r->user()->id;
        return Availability::create($data);
    }

    public function destroy(Request $r, Availability $availability){
        $this->ensureDoctor($r);
        abort_if($availability->doctor_id !== $r->user()->id, 403);
        $availability->delete();
        return response()->noContent();
    }
}