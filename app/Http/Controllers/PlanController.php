<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    /**
     * Menampilkan daftar semua catatan.
     */
    public function index()
    {
        return Inertia::render('Notes/Index', [
            'notes' => Plan::latest()->get(),
        ]);
    }

    /**
     * Menampilkan form untuk membuat rencana baru.
     */
    public function create()
    {
        return Inertia::render('Plans/Create');
    }

    /**
     * Menyimpan rencana baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(['title' => 'required|string|max:255', 'content' => 'required|string',]);

        Plan::create($validated);

        return to_route('home')->with('message', 'Rencana berhasil ditambahkan!');
    }
}