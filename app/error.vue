<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-6"
        style="background: #fefcf9; font-family: 'Georgia', serif;">

        <div class="max-w-lg w-full text-center">

            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm" :style="badge.style"
                style="font-family: system-ui, sans-serif;">
                <span>{{ badge.emoji }}</span>
                <span class="font-medium">{{ badge.label }}</span>
            </div>

            <!-- Big error number -->
            <div class="relative mb-6">
                <span class="text-[10rem] font-bold leading-none select-none block"
                    style="letter-spacing: -0.05em; color: #f1ede6;">{{ error.statusCode }}</span>
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-6xl">{{ badge.emoji }}</span>
                </div>
            </div>

            <!-- Title -->
            <h1 class="text-4xl font-bold text-slate-800 mb-3" style="letter-spacing: -0.03em;">
                {{ title }}
            </h1>

            <!-- Description -->
            <p class="text-slate-500 leading-relaxed mb-10"
                style="font-family: system-ui, sans-serif; font-size: 1rem;">
                {{ description }}
            </p>

            <!-- Word chips -->
            <div class="flex items-center justify-center gap-2 mb-10 flex-wrap">
                <span v-for="chip in chips" :key="chip.word" class="px-3 py-1 rounded-full text-sm font-medium"
                    :style="chip.style">{{ chip.word }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-center gap-3" style="font-family: system-ui, sans-serif;">
                <button
                    class="px-6 py-3 rounded-2xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-all hover:scale-105 cursor-pointer"
                    @click="handleError">
                    ← Volver al inicio
                </button>
                <a href="/stories"
                    class="px-6 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 text-sm font-medium hover:border-slate-300 transition-all hover:scale-105">
                    Ver historias
                </a>
            </div>

        </div>

    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: {
        type: Object as () => NuxtError,
        required: true,
    }
})

const handleError = () => clearError({ redirect: '/' })

const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
    is404.value ? 'Página no encontrada' : 'Algo salió mal'
)

const description = computed(() =>
    is404.value
        ? 'La página que buscás no existe o fue movida. Pero hay muchas historias esperándote.'
        : 'Hubo un error inesperado en el servidor. Ya estamos al tanto. Mientras tanto, podés volver al inicio.'
)

const badge = computed(() =>
    is404.value
        ? { emoji: '🗺️', label: 'Error 404 · No encontrado', style: 'background: #fef3e0; color: #F5A623; border-color: #fde8c0;' }
        : { emoji: '⚡', label: 'Error 500 · Error del servidor', style: 'background: #fde8eb; color: #E8445A; border-color: #fbc8cf;' }
)

const chips = computed(() => is404.value
    ? [
        { word: 'lost', style: 'background: #fde8eb; color: #E8445A;' },
        { word: 'missing', style: 'background: #fef3e0; color: #F5A623;' },
        { word: 'wandering', style: 'background: #e0f7f6; color: #2BBCB8;' },
        { word: 'explore', style: 'background: #e6f6ec; color: #4CAF7D;' },
    ]
    : [
        { word: 'oops', style: 'background: #fde8eb; color: #E8445A;' },
        { word: 'broken', style: 'background: #fef3e0; color: #F5A623;' },
        { word: 'fixing', style: 'background: #e0f7f6; color: #2BBCB8;' },
        { word: 'soon', style: 'background: #e6f6ec; color: #4CAF7D;' },
    ]
)
</script>