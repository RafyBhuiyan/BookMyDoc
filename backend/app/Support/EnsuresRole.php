<?php
namespace App\Support;

use Illuminate\Http\Request;
use App\Models\Doctor;
use App\Models\User;

trait EnsuresRole
{
    protected function ensureDoctor(Request $request): void
    {
        $u = $request->user();
        if (! $u || ! ($u instanceof Doctor)) {
            abort(403, 'Doctor token required');
        }
        // If you are issuing abilities, optionally also check them:
        if ($u->currentAccessToken() && ! $u->tokenCan('doctor')) {
            abort(403, 'Doctor ability required');
        }
    }

    protected function ensurePatient(Request $request): void
    {
        $u = $request->user();
        if (! $u || ! ($u instanceof User)) {
            abort(403, 'Patient token required');
        }
        if ($u->currentAccessToken() && ! $u->tokenCan('patient')) {
            abort(403, 'Patient ability required');
        }
    }
}
