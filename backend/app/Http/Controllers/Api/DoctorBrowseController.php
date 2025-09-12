<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DoctorBrowseController extends Controller
{
    // GET /api/doctors?search=&specialization=&city=&available_on=YYYY-MM-DD&per_page=
    public function index(Request $r){
        $per = min(max((int)$r->integer('per_page',12),1),50);

        $q = Doctor::query()
            ->search($r->string('search'))
            ->specialization($r->string('specialization'))
            ->city($r->string('city'))
            ->hasAvailabilityOn($r->string('available_on'))
            ->orderBy('name');

        return $q->paginate($per)->withQueryString();
    }

    public function show(Doctor $doctor){ return $doctor; }

    /**
     * GET /api/doctors/{doctor}/slots?date=YYYY-MM-DD
     * Returns ALL time slices on that date with a status:
     *   available | pending | accepted | declined | past
     */
    public function slots(Request $r, Doctor $doctor){
        $r->validate(['date' => ['required','date_format:Y-m-d']]);
        $date = Carbon::createFromFormat('Y-m-d', $r->query('date'))->startOfDay();

        $windows = $doctor->availabilities()
            ->where('date', $date->toDateString())
            ->orderBy('start_time')->get();

        // appointments grouped by H:i for that date
        $apptsByMin = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('starts_at', $date->toDateString())
            ->get()
            ->groupBy(fn($a) => Carbon::parse($a->starts_at)->format('H:i'));

        $now = now();
        $slots = [];

        foreach ($windows as $w) {
            $step = $w->slot_minutes ?? 30;
            $cur  = Carbon::parse($w->date.' '.$w->start_time);
            $end  = Carbon::parse($w->date.' '.$w->end_time);

            while ($cur->copy()->addMinutes($step) <= $end) {
                $hh = $cur->format('H:i');

                // default status
                $status = 'available';

                if ($now->gte($cur)) {
                    $status = 'past';
                } elseif (isset($apptsByMin[$hh])) {
                    $g = $apptsByMin[$hh];
                    if ($g->firstWhere('status','accepted'))      $status = 'accepted';
                    elseif ($g->firstWhere('status','pending'))   $status = 'pending';
                    elseif ($g->firstWhere('status','declined'))  $status = 'declined';
                }

                $slots[] = [
                    'starts_at' => $cur->toIso8601String(),
                    'ends_at'   => $cur->copy()->addMinutes($step)->toIso8601String(),
                    'duration'  => $step,
                    'status'    => $status, // <- let frontend color/disable
                ];

                $cur->addMinutes($step);
            }
        }

        return [
            'date'      => $date->toDateString(),
            'doctor_id' => $doctor->id,
            'slots'     => $slots,
        ];
    }

    /**
     * GET /api/doctors/{doctor}/slots/all
     * Optional: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
     * Defaults to [today .. today+14], max 60-day span.
     * Returns days[] each with slots[] and the same status field.
     */
    public function allSlots(Request $r, Doctor $doctor){
        $r->validate([
            'start_date' => ['nullable','date_format:Y-m-d'],
            'end_date'   => ['nullable','date_format:Y-m-d'],
        ]);

        $start = $r->query('start_date')
            ? Carbon::createFromFormat('Y-m-d', $r->query('start_date'))->startOfDay()
            : Carbon::today();
        $end = $r->query('end_date')
            ? Carbon::createFromFormat('Y-m-d', $r->query('end_date'))->endOfDay()
            : Carbon::today()->copy()->addDays(14)->endOfDay();

        // Cap to 60 days from start
        if ($end->gt($start->copy()->addDays(60))) {
            $end = $start->copy()->addDays(60)->endOfDay();
        }

        $windows = $doctor->availabilities()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('date')->orderBy('start_time')->get();

        // appointments grouped date => H:i
        $appts = Appointment::where('doctor_id', $doctor->id)
            ->whereBetween('starts_at', [$start, $end])
            ->get()
            ->groupBy(fn($a) => Carbon::parse($a->starts_at)->toDateString())
            ->map(fn($day) => $day->groupBy(fn($a) => Carbon::parse($a->starts_at)->format('H:i')));

        $now = now();
        $byDate = [];

        foreach ($windows as $w) {
            $date = $w->date;
            $step = $w->slot_minutes ?? 30;

            $cur  = Carbon::parse($w->date.' '.$w->start_time);
            $endT = Carbon::parse($w->date.' '.$w->end_time);

            while ($cur->copy()->addMinutes($step) <= $endT) {
                $hh = $cur->format('H:i');
                $status = 'available';

                if ($now->gte($cur)) {
                    $status = 'past';
                } elseif (isset($appts[$date]) && isset($appts[$date][$hh])) {
                    $g = $appts[$date][$hh];
                    if ($g->firstWhere('status','accepted'))      $status = 'accepted';
                    elseif ($g->firstWhere('status','pending'))   $status = 'pending';
                    elseif ($g->firstWhere('status','declined'))  $status = 'declined';
                }

                $byDate[$date][] = [
                    'starts_at' => $cur->toIso8601String(),
                    'ends_at'   => $cur->copy()->addMinutes($step)->toIso8601String(),
                    'duration'  => $step,
                    'status'    => $status,
                ];

                $cur->addMinutes($step);
            }
        }

        // Normalize inclusive range
        $result = [];
        $period = new \DatePeriod(
            Carbon::parse($start->toDateString()),
            new \DateInterval('P1D'),
            Carbon::parse($end->toDateString())->copy()->addDay()
        );

        foreach ($period as $d) {
            $key = $d->format('Y-m-d');
            $result[] = [
                'date'  => $key,
                'slots' => array_values($byDate[$key] ?? []),
            ];
        }

        return [
            'doctor_id'  => $doctor->id,
            'start_date' => $start->toDateString(),
            'end_date'   => $end->toDateString(),
            'days'       => $result,
        ];
    }
}
