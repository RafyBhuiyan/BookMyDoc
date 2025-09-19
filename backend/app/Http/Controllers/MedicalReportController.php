<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
class MedicalReportController extends Controller
{
     public function generate(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);
        $user = User::where('name', $data['name'])
                    ->where('email', $data['email'])
                    ->first();

        if (! $user) {
            return back()->withErrors(['user' => 'User not found with provided name and email.']);
        }
        $viewData = [
            'user' => $user,
        ];
        $pdf = Pdf::loadView('pdf', $viewData);

        // return $pdf->stream("medical-report-{$user->id}.pdf");
        return $pdf->download("medical-report-{$user->id}.pdf");
    }
}
