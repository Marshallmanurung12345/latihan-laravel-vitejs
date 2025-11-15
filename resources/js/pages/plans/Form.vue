<template>
    <AppLayout :title="formTitle">
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ formTitle }}
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    <div class="p-6 sm:px-20 bg-white border-b border-gray-200">
                        <form @submit.prevent="submit">
                            <!-- Title -->
                            <div class="mb-6">
                                <label
                                    for="title"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Judul Rencana
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    v-model="form.title"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Masukkan judul rencana..."
                                    required
                                />
                                <div
                                    v-if="form.errors.title"
                                    class="text-red-500 text-xs mt-1"
                                >
                                    {{ form.errors.title }}
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="mb-6">
                                <label
                                    for="content"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Detail Rencana
                                </label>
                                <TrixEditor
                                    v-model="form.content"
                                    @trix-file-accept="handleFile"
                                    @trix-attachment-add="storeAttachment"
                                />
                                <div
                                    v-if="form.errors.content"
                                    class="text-red-500 text-xs mt-1"
                                >
                                    {{ form.errors.content }}
                                </div>
                            </div>

                            <!-- Cover Image -->
                            <div class="mb-6">
                                <label
                                    for="cover_image"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Gambar Sampul
                                </label>
                                <input
                                    type="file"
                                    @input="form.cover_image = $event.target.files[0]"
                                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    id="cover_image"
                                />
                                <progress
                                    v-if="form.progress"
                                    :value="form.progress.percentage"
                                    max="100"
                                >
                                    {{ form.progress.percentage }}%
                                </progress>
                                <div
                                    v-if="form.errors.cover_image"
                                    class="text-red-500 text-xs mt-1"
                                >
                                    {{ form.errors.cover_image }}
                                </div>
                                <img
                                    v-if="imageUrl && !form.cover_image"
                                    :src="imageUrl"
                                    class="mt-4 h-48 object-cover"
                                    alt="Current Cover"
                                />
                            </div>

                            <!-- Status (Selesai / Belum Selesai) -->
                            <div class="mb-6">
                                <label
                                    for="is_completed"
                                    class="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Status Rencana
                                </label>
                                <select
                                    id="is_completed"
                                    v-model.number="form.is_completed"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                >
                                    <option :value="0">Belum selesai</option>
                                    <option :value="1">Selesai</option>
                                </select>
                                <div
                                    v-if="form.errors.is_completed"
                                    class="text-red-500 text-xs mt-1"
                                >
                                    {{ form.errors.is_completed }}
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex items-center justify-end">
                                <button
                                    type="submit"
                                    :disabled="form.processing"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                    :class="{ 'opacity-25': form.processing }"
                                >
                                    {{
                                        isEditing
                                            ? "Perbarui Rencana"
                                            : "Simpan Rencana"
                                    }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed } from "vue";
import { useForm } from "@inertiajs/vue3";
import AppLayout from "@/Layouts/AppLayout.vue";
import TrixEditor from "@/Components/TrixEditor.vue";
import axios from "axios";

const props = defineProps({
    plan: Object, // plan akan null jika 'create', dan berisi data jika 'edit'
});

const isEditing = computed(() => !!props.plan);
const formTitle = computed(() =>
    isEditing.value ? "Edit Rencana" : "Tambah Rencana Baru"
);
const imageUrl = computed(() =>
    props.plan && props.plan.cover ? `/storage/${props.plan.cover}` : null
);

const form = useForm({
    _method: isEditing.value ? "PUT" : "POST",
    title: props.plan?.title || "",
    content: props.plan?.content || "",
    cover_image: null,
    // gunakan 1/0 supaya gampang di-handle di Laravel
    is_completed: props.plan?.completed_at ? 1 : 0,
});

const submit = () => {
    const url = isEditing.value
        ? route("plans.update", props.plan.id)
        : route("plans.store");

    form.post(url, {
        // forceFormData: true, // gunakan ini jika ada masalah dengan pengiriman file
        onSuccess: () => form.reset("title", "content", "cover_image", "is_completed"),
    });
};

// Handler untuk Trix Editor
const handleFile = (e) => {
    // Mencegah file selain gambar untuk di-upload
    if (!e.file.type.match("image.*")) {
        e.preventDefault();
        alert("Hanya file gambar yang diizinkan.");
    }
};

const storeAttachment = (event) => {
    const attachment = event.attachment;
    const form_data = new FormData();
    form_data.append("attachment", attachment.file);

    axios
        .post(route("plans.attachments.store"), form_data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                attachment.setUploadProgress(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
            },
        })
        .then((response) => {
            attachment.setAttributes({
                url: response.data.url,
                href: response.data.url,
            });
        })
        .catch((error) => {
            console.error("Upload failed:", error);
        });
};
</script>
