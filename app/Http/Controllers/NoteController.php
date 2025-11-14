<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    /**
     * Menampilkan daftar semua catatan.
     */
    public function index()
    {
        return Inertia::render('Notes/Index', [
            'notes' => Note::latest()->get(),
        ]);
    }

    /**
     * Menampilkan form untuk membuat catatan baru.
     */
    public function create()
    {
        return Inertia::render('Notes/Create');
    }

    /**
     * Menyimpan catatan baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(['title' => 'required|string|max:255', 'content' => 'required|string',]);

        Note::create($validated);

        return to_route('notes.index')->with('message', 'Catatan berhasil ditambahkan!');
    }
}