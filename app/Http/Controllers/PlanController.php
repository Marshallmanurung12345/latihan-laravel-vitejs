<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlanRequest;
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
        // Hanya ambil rencana milik pengguna yang sedang login
        $plansQuery = Plan::where('user_id', auth()->id())
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest();

        // Statistik untuk ApexCharts (lebih efisien dengan satu kueri)
        $baseStatsQuery = Plan::where('user_id', auth()->id());
        $stats = [
            'total' => $baseStatsQuery->clone()->count(),
            'completed' => $baseStatsQuery->clone()->completed()->count(),
            'in_progress' => $baseStatsQuery->clone()->inProgress()->count(),
            'pending' => $baseStatsQuery->clone()->pending()->count(),
        ];

        return Inertia::render('app/HomePage', [
            // Gunakan Resource Collection untuk transformasi data paginasi
            'plans' => PlanResource::collection($plansQuery->paginate(20)->withQueryString()),
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Menampilkan detail satu rencana (jika diperlukan).
     */
    public function show(Plan $plan): Response
    {
        return Inertia::render('plans/Show', [
            'plan' => new PlanResource($plan->load('user')),
        ]);
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
    public function store(PlanRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $validated['user_id'] = auth()->id(); // Tambahkan ID pengguna yang sedang login

        // Jika status adalah 'completed', set waktu sekarang.
        if (isset($validated['status']) && $validated['status'] === 'completed') {
            $validated['completed_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover'] = $request->file('cover_image')->store('covers', 'public');
        }

        $plan = Plan::create($validated);

        return to_route('home')->with('success', 'Rencana berhasil ditambahkan!');
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
    public function update(PlanRequest $request, Plan $plan): RedirectResponse
    {
        $validated = $request->validated();

        // Secara otomatis mengatur atau menghapus `completed_at` hanya jika status berubah.
        if (isset($validated['status'])) {
            // Jika status diubah menjadi 'completed' dan sebelumnya BUKAN 'completed'.
            if ($validated['status'] === 'completed' && $plan->status !== 'completed') {
                $validated['completed_at'] = now();
            // Jika status diubah DARI 'completed' ke status lain.
            } elseif ($validated['status'] !== 'completed' && $plan->status === 'completed') {
                $validated['completed_at'] = null;
            }
        }
        // Cek jika ada file gambar baru yang diunggah
        if ($request->hasFile('cover_image')) {
            // Hapus gambar lama jika ada sebelum mengunggah yang baru
            if ($plan->cover) {
                Storage::disk('public')->delete($plan->cover);
            }
            $validated['cover'] = $request->file('cover_image')->store('covers', 'public');
        }

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