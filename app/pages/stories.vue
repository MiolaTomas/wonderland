<script setup lang="ts">


import { ref, computed } from 'vue'

interface Story {
    id: number
    title: string
    level: string
    duration: 'corta' | 'media' | 'larga'
    minutes: number
    words: number
    genre: string
    emoji: string
    desc: string
    color: string
    badge: string
    accent: string
    genreBadge: string
}

const allStories: Story[] = [
    { id: 1, title: 'The Midnight Key', level: 'A2', duration: 'corta', minutes: 3, words: 67, genre: 'misterio', emoji: '🗝️', desc: 'Una mujer encuentra una misteriosa llave bajo un viejo roble que lo cambia todo.', color: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-500', accent: 'bg-rose-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 2, title: 'A Walk in the Rain', level: 'A1', duration: 'corta', minutes: 2, words: 48, genre: 'vida cotidiana', emoji: '🌧️', desc: 'Un tranquilo paseo de tarde se convierte en un momento de alegría inesperada.', color: 'bg-sky-50 border-sky-200', badge: 'bg-sky-100 text-sky-500', accent: 'bg-sky-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 3, title: 'The Last Letter', level: 'B1', duration: 'media', minutes: 5, words: 112, genre: 'romance', emoji: '✉️', desc: 'Una carta encontrada en un cajón olvidado revela un secreto guardado por décadas.', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-600', accent: 'bg-amber-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 4, title: 'Voices in the Library', level: 'B2', duration: 'media', minutes: 7, words: 158, genre: 'misterio', emoji: '📚', desc: 'De noche, un bibliotecario escucha voces provenientes de la sección restringida.', color: 'bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-500', accent: 'bg-violet-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 5, title: 'The Glass Garden', level: 'B1', duration: 'corta', minutes: 4, words: 98, genre: 'fantasía', emoji: '🌿', desc: 'Un jardín escondido hecho enteramente de vidrio guarda las respuestas a un viejo misterio.', color: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-500', accent: 'bg-teal-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 6, title: 'Stars Over the City', level: 'C1', duration: 'larga', minutes: 8, words: 201, genre: 'ciencia ficción', emoji: '⭐', desc: 'Una astrónoma descubre un patrón en las estrellas que nadie había visto antes.', color: 'bg-lime-50 border-lime-200', badge: 'bg-lime-100 text-lime-600', accent: 'bg-lime-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 7, title: 'The Old Bridge', level: 'A1', duration: 'corta', minutes: 2, words: 41, genre: 'vida cotidiana', emoji: '🌉', desc: 'Cada mañana, un hombre mayor cruza el mismo puente y recuerda una historia diferente.', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-500', accent: 'bg-orange-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 8, title: 'Frozen in Time', level: 'B2', duration: 'larga', minutes: 9, words: 210, genre: 'ciencia ficción', emoji: '🧊', desc: 'Una científica despierta en un laboratorio vacío y descubre que el tiempo se ha detenido.', color: 'bg-cyan-50 border-cyan-200', badge: 'bg-cyan-100 text-cyan-600', accent: 'bg-cyan-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 9, title: 'The Red Umbrella', level: 'A2', duration: 'corta', minutes: 3, words: 72, genre: 'romance', emoji: '☂️', desc: 'Dos extraños comparten un paraguas rojo durante una tormenta y cambian sus vidas para siempre.', color: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-500', accent: 'bg-rose-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 10, title: 'The Clockmaker', level: 'B1', duration: 'media', minutes: 6, words: 134, genre: 'fantasía', emoji: '⏰', desc: 'Un anciano relojero descubre que puede retroceder el tiempo arreglando relojes rotos.', color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-600', accent: 'bg-yellow-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 11, title: 'Lost in Translation', level: 'C1', duration: 'larga', minutes: 10, words: 245, genre: 'vida cotidiana', emoji: '🌍', desc: 'Una traductora en Tokio se da cuenta de que algunas palabras no pueden traducirse y cambian quien sos.', color: 'bg-indigo-50 border-indigo-200', badge: 'bg-indigo-100 text-indigo-500', accent: 'bg-indigo-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 12, title: 'The Empty Chair', level: 'B2', duration: 'media', minutes: 7, words: 167, genre: 'drama', emoji: '🪑', desc: 'En cada reunión familiar hay una silla vacía. Nadie la menciona, pero todos saben por qué.', color: 'bg-stone-50 border-stone-200', badge: 'bg-stone-100 text-stone-500', accent: 'bg-stone-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 13, title: 'The Fox and the Moon', level: 'A2', duration: 'corta', minutes: 4, words: 89, genre: 'fantasía', emoji: '🦊', desc: 'Una zorra que solo sale de noche cree que la luna es su mejor amiga hasta que sale el sol.', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-600', accent: 'bg-amber-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 14, title: 'Signal Lost', level: 'C1', duration: 'larga', minutes: 11, words: 267, genre: 'ciencia ficción', emoji: '📡', desc: 'La última estación espacial recibe una señal que lleva 200 años viajando por el universo.', color: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-500', accent: 'bg-slate-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 15, title: 'First Day', level: 'A1', duration: 'corta', minutes: 2, words: 44, genre: 'vida cotidiana', emoji: '🎒', desc: 'El primer día de escuela de una nena en un país nuevo donde no conoce a nadie.', color: 'bg-pink-50 border-pink-200', badge: 'bg-pink-100 text-pink-500', accent: 'bg-pink-200', genreBadge: 'bg-slate-100 text-slate-500' },
    { id: 16, title: 'The Detective', level: 'B2', duration: 'larga', minutes: 8, words: 189, genre: 'misterio', emoji: '🔍', desc: 'Una detective resuelve crímenes usando solo el lenguaje corporal, hasta que conoce a alguien que la desafía.', color: 'bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-500', accent: 'bg-violet-200', genreBadge: 'bg-slate-100 text-slate-500' },
]

const levelDots: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 }
const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
const durations = [
    { key: 'corta', label: 'Corta', hint: '< 4 min' },
    { key: 'media', label: 'Media', hint: '4–7 min' },
    { key: 'larga', label: 'Larga', hint: '> 7 min' },
]
const genres = [...new Set(allStories.map(s => s.genre))].sort()

const search = ref('')
const selectedLevels = ref<string[]>([])
const selectedDurations = ref<string[]>([])
const selectedGenres = ref<string[]>([])

function toggleFilter<T>(arr: T[], value: T) {
    const idx = arr.indexOf(value)
    if (idx === -1) arr.push(value)
    else arr.splice(idx, 1)
}

const activeFilterCount = computed(() =>
    selectedLevels.value.length + selectedDurations.value.length + selectedGenres.value.length
)

function clearAll() {
    selectedLevels.value = []
    selectedDurations.value = []
    selectedGenres.value = []
    search.value = ''
}

const filteredStories = computed(() => {
    return allStories.filter(s => {
        const matchSearch = search.value === '' || s.title.toLowerCase().includes(search.value.toLowerCase())
        const matchLevel = selectedLevels.value.length === 0 || selectedLevels.value.includes(s.level)
        const matchDuration = selectedDurations.value.length === 0 || selectedDurations.value.includes(s.duration)
        const matchGenre = selectedGenres.value.length === 0 || selectedGenres.value.includes(s.genre)
        return matchSearch && matchLevel && matchDuration && matchGenre
    })
})
</script>

<template>
    <div class="min-h-screen w-full overflow-x-hidden" style="background: #fefcf9; font-family: 'Georgia', serif;">

        <!-- Header -->
        <div class="w-full border-b border-slate-100 px-8 py-10" style="background: #fefcf9;">
            <div class="max-w-6xl mx-auto">
                <div class="flex items-center gap-2 mb-1">
                    <a href="/" class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                        style="font-family: system-ui, sans-serif;">← Volver</a>
                </div>
                <div class="flex flex-col gap-4 mt-4">
                    <div>
                        <p class="text-xs uppercase tracking-widest text-slate-400 mb-2"
                            style="font-family: system-ui, sans-serif;">La biblioteca</p>
                        <h1 class="text-5xl font-bold text-slate-800" style="letter-spacing: -0.03em;">Todas las
                            historias</h1>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-8 py-10">
            <div class="flex flex-col lg:flex-row gap-10">

                <!-- Sidebar filters -->
                <aside class="w-full lg:w-56 shrink-0" style="font-family: system-ui, sans-serif;">
                    <div class="sticky top-6">

                        <!-- Filter header -->
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-sm font-semibold text-slate-700">Filtros</span>
                            <button v-if="activeFilterCount > 0"
                                class="text-xs text-violet-500 hover:text-violet-700 transition-colors underline underline-offset-2"
                                @click="clearAll">
                                Limpiar ({{ activeFilterCount }})
                            </button>
                        </div>

                        <!-- Level filter -->
                        <div class="mb-8">
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Nivel</p>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="level in levels" :key="level"
                                    class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all hover:scale-105"
                                    :class="selectedLevels.includes(level)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'"
                                    @click="toggleFilter(selectedLevels, level)">
                                    {{ level }}
                                </button>
                            </div>
                        </div>

                        <!-- Duration filter -->
                        <div class="mb-8">
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Duración</p>
                            <div class="flex flex-col gap-2">
                                <button v-for="d in durations" :key="d.key"
                                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs border-2 transition-all text-left"
                                    :class="selectedDurations.includes(d.key)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'"
                                    @click="toggleFilter(selectedDurations, d.key)">
                                    <span class="font-medium">{{ d.label }}</span>
                                    <span class="opacity-60">{{ d.hint }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Genre filter -->
                        <div>
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Género</p>
                            <div class="flex flex-col gap-1.5">
                                <button v-for="genre in genres" :key="genre"
                                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border-2 transition-all text-left capitalize"
                                    :class="selectedGenres.includes(genre)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'"
                                    @click="toggleFilter(selectedGenres, genre)">
                                    <span class="w-2 h-2 rounded-full shrink-0"
                                        :class="selectedGenres.includes(genre) ? 'bg-white' : 'bg-violet-200'">
                                    </span>
                                    {{ genre }}
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                <!-- Stories grid -->
                <div class="flex-1">

                    <!-- Results count + search + active filters -->
                    <div class="flex flex-wrap items-center gap-3 mb-6" style="font-family: system-ui, sans-serif;">
                        <p class="text-sm text-slate-500 shrink-0">
                            Mostrando <span class="font-semibold text-slate-700">{{ filteredStories.length }}</span> de
                            <span class="font-semibold text-slate-700">{{ allStories.length }}</span> historias
                        </p>
                        <!-- Search -->
                        <div class="relative flex-1">
                            <input v-model="search" type="text" placeholder="Buscar por título..."
                                class="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all" />
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
                        </div>
                        <!-- Active filter chips -->
                        <div class="flex flex-wrap gap-2">
                            <span v-for="level in selectedLevels" :key="'l' + level"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-white">
                                {{ level }}
                                <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedLevels, level)">×</button>
                            </span>
                            <span v-for="d in selectedDurations" :key="'d' + d"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-white capitalize">
                                {{ d }}
                                <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedDurations, d)">×</button>
                            </span>
                            <span v-for="g in selectedGenres" :key="'g' + g"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-violet-500 text-white capitalize">
                                {{ g }}
                                <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedGenres, g)">×</button>
                            </span>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div v-if="filteredStories.length > 0" class="flex flex-col gap-4">
                        <a v-for="story in filteredStories" :key="story.id" href="/reader"
                            class="group rounded-3xl p-6 border-2 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-xl flex flex-row items-center gap-6"
                            :class="story.color">

                            <!-- Emoji -->
                            <span class="text-4xl shrink-0">{{ story.emoji }}</span>

                            <!-- Main content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span
                                        class="text-xs font-medium px-2 py-0.5 rounded-full capitalize bg-white/70 text-slate-500"
                                        style="font-family: system-ui, sans-serif;">{{ story.genre }}</span>
                                    <span class="text-xs font-bold px-3 py-1 rounded-full" :class="story.badge"
                                        style="font-family: system-ui, sans-serif;">{{ story.level }}</span>
                                </div>
                                <h3
                                    class="text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors mb-1">
                                    {{ story.title }}
                                </h3>
                                <p class="text-xs text-slate-500 leading-relaxed line-clamp-2"
                                    style="font-family: system-ui, sans-serif;">{{ story.desc }}</p>
                            </div>

                            <!-- Right side: bar + meta -->
                            <div class="shrink-0 flex flex-col items-end gap-3 w-32">
                                <div class="flex gap-1 w-full">
                                    <div v-for="dot in 6" :key="dot" class="h-1.5 flex-1 rounded-full transition-all"
                                        :class="dot <= (levelDots[story.level] ?? 1) ? story.accent : 'bg-white/60'">
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-1 text-xs text-slate-400"
                                    style="font-family: system-ui, sans-serif;">
                                    <span>🕐 {{ story.minutes }} min</span>
                                    <span>📝 {{ story.words }} palabras</span>
                                </div>
                                <span
                                    class="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Leer
                                    →</span>
                            </div>

                        </a>
                    </div>

                    <!-- Empty state -->
                    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
                        <p class="text-5xl mb-4">🔍</p>
                        <h3 class="text-xl font-bold text-slate-700 mb-2">Sin resultados</h3>
                        <p class="text-sm text-slate-400 mb-6" style="font-family: system-ui, sans-serif;">
                            No encontramos historias con esos filtros. Probá con otros.
                        </p>
                        <button
                            class="px-6 py-3 rounded-2xl bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-all"
                            style="font-family: system-ui, sans-serif;" @click="clearAll">
                            Limpiar filtros
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>