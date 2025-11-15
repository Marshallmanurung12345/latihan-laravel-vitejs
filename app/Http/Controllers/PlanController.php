<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Menampilkan daftar semua rencana.
     */
    public function index(Request $request): Response
    {
        $plansQuery = Plan::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->latest();

        // Statistik untuk ApexCharts
        $stats = [
            'total' => Plan::count(),
            'done' => Plan::whereNotNull('completed_at')->count(),
            'pending' => Plan::whereNull('completed_at')->count(),
        ];

        return Inertia::render('app/HomePage', [ // Kembali ke komponen yang ada
            // Gunakan Resource Collection untuk transformasi data paginasi
            'plans' => PlanResource::collection($plansQuery->paginate(20)->withQueryString()),
            'filters' => $request->only(['search']),
            'stats' => $stats,
        ]);
    }

    /**
     * Menampilkan detail satu rencana (jika diperlukan).
     */
    public function show(Plan $plan): Response
    {
        return Inertia::render('plans/Show', ['plan' => new PlanResource($plan)]);
    }

    /**
     * Menampilkan form untuk membuat rencana baru.
     */
    public function create(): Response
    {
        return Inertia::render('plans/Form', [
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
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $validated['cover'] = $request->file('cover_image')->store('covers', 'public');
        }
        // Hapus cover_image dari array yang divalidasi karena tidak ada di tabel database
        unset($validated['cover_image']);

        $plan = Plan::create($validated);

        return to_route('plans.index')->with('success', 'Rencana berhasil ditambahkan!');
    }

    /**
     * Menampilkan form untuk mengedit rencana.
     */
    public function edit(Plan $plan): Response
    {
        return Inertia::render('plans/Form', [
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
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            // Hapus cover lama jika ada
            if ($plan->cover) {
                Storage::disk('public')->delete($plan->cover);
            }
            $validated['cover'] = $request->file('cover_image')->store('covers', 'public');
        }
        // Hapus cover_image dari array yang divalidasi
        unset($validated['cover_image']);

        $plan->update($validated);

        return to_route('plans.index')->with('success', 'Rencana berhasil diperbarui!');
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

        return to_route('plans.index')->with('success', 'Rencana berhasil dihapus!');
    }

    /**
     * Menyimpan file attachment dari Trix Editor.
     */
    public function storeAttachment(Request $request)
    {
        $request->validate([
            'attachment' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments', 'public');
            $url = Storage::disk('public')->url($path);

            return response()->json(['url' => $url], 200);
        }
    }

}