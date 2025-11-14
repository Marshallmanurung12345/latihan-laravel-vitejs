<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        return Inertia::render('app/HomePage', [
            'plans' => Plan::latest()->get(),
        ]);
    }
}