<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Menampilkan daftar semua rencana dengan paginasi dan filter.
     */
    public function index(Request $request): Response
    {
        $plans = Plan::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Statistik untuk ApexCharts
        $stats = [
            'total' => Plan::count(),
            'done' => 0, // Ganti dengan logika status jika ada
            'pending' => Plan::count(), // Ganti dengan logika status jika ada
        ];

        return Inertia::render('app/HomePage', [
            'plans' => $plans,
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }

    /**
     * Menampilkan form untuk membuat rencana baru.
     */
    public function create(): Response
    {
        return Inertia::render('Plans/Form', [
            'plan' => null,
        ]);
    }

    /**
     * Menyimpan rencana baru ke database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        Plan::create($validated);

        return to_route('home')->with('success', 'Rencana berhasil ditambahkan!');
    }

    /**
     * Menampilkan form untuk mengedit rencana.
     */
    public function edit(Plan $plan): Response
    {
        return Inertia::render('Plans/Form', [
            'plan' => $plan,
        ]);
    }

    /**
     * Memperbarui rencana di database.
     */
    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $plan->update($validated);

        return to_route('home')->with('success', 'Rencana berhasil diperbarui!');
    }

    /**
     * Menghapus rencana dari database.
     */
    public function destroy(Plan $plan): RedirectResponse
    {
        if ($plan->cover) {
            Storage::disk('public')->delete($plan->cover);
        }
        $plan->delete();

        return to_route('home')->with('success', 'Rencana berhasil dihapus!');
    }

    /**
     * Memperbarui cover rencana.
     */
    public function updateCover(Request $request, Plan $plan): RedirectResponse
    {
        $request->validate(['cover' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048']);

        $path = $request->file('cover')->store('covers', 'public');
        $plan->update(['cover' => $path]);

        return back()->with('success', 'Cover berhasil diperbarui!');
    }
}