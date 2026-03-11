<script setup lang="ts">
import { getGenreColors } from '@/utils/genre'
import indexData from '@/data/stories/index.json'

interface Story {
    title: string
    slug: string
    level: string
    genre: string
    duration: string
    emoji: string
    description: string
    wordCount: number
    minutes: number
}

// ─── Data ────────────────────────────────────────────────────────────────────

const allStories: Story[] = indexData

// Esto muestra los puntitos cuando se renderiza la historia
const levelDots: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 }
const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const durations = [
    { key: 'short', label: 'Corta', hint: '< 4 min' },
    { key: 'medium', label: 'Media', hint: '4–7 min' },
    { key: 'long', label: 'Larga', hint: '> 7 min' },
]
console.log('durations:', durations)
// El array de genres se auto importa desde utils

// ─── Filters ─────────────────────────────────────────────────────────────────

const search = ref('')
const selectedLevels = ref<string[]>([])
const selectedDurations = ref<string[]>([])
const selectedGenres = ref<string[]>([])

function toggleFilter<T>(arr: T[], value: T) {
    console.log('toggling', value, 'in', arr)
    const idx = arr.indexOf(value)
    idx === -1 ? arr.push(value) : arr.splice(idx, 1)
}

// so essentialy the toggleFilter, if it finds doesn't find the value it adds it, if it finds it, it deletes it, is this right

const activeFilterCount = computed(() =>
    selectedLevels.value.length + selectedDurations.value.length + selectedGenres.value.length
)

function clearAll() {
    selectedLevels.value = []
    selectedDurations.value = []
    selectedGenres.value = []
    search.value = ''
}

const filteredStories = computed(() =>
    allStories.filter(s => {
        const matchSearch = !search.value || s.title.toLowerCase().includes(search.value.toLowerCase())
        const matchLevel = !selectedLevels.value.length || selectedLevels.value.includes(s.level)
        const matchDuration = !selectedDurations.value.length || selectedDurations.value.includes(s.duration)
        console.log(s.title, '| duration:', s.duration, '| match:', matchDuration, '| selected:', selectedDurations.value)
        const matchGenre = !selectedGenres.value.length || selectedGenres.value.includes(s.genre)
        return matchSearch && matchLevel && matchDuration && matchGenre
    })
)

// ─── Pagination ───────────────────────────────────────────────────────────────

// const PER_PAGE = 10
// const currentPage = ref(1)


// watch([search, selectedLevels, selectedDurations, selectedGenres], () => {
//     currentPage.value = 1
// })

// const totalPages = computed(() => Math.ceil(filteredStories.value.length / PER_PAGE))

// const paginatedStories = computed(() => {
//     const start = (currentPage.value - 1) * PER_PAGE
//     return filteredStories.value.slice(start, start + PER_PAGE)
// })

// const pageNumbers = computed(() => {
//     const total = totalPages.value
//     const current = currentPage.value
//     if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

//     const pages: (number | '...')[] = [1]
//     if (current > 3) pages.push('...')
//     for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
//     if (current < total - 2) pages.push('...')
//     pages.push(total)
//     return pages
// })

const PER_PAGE = 5
const currentPage = ref(1)

// Reset to page 1 when filters change
watch([search, selectedLevels, selectedDurations, selectedGenres], () => {
    currentPage.value = 1
})

const paginatedStories = computed(() => {
    const start = (currentPage.value - 1) * PER_PAGE
    return filteredStories.value.slice(start, start + PER_PAGE)
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

                        <div class="flex items-center justify-between mb-6">
                            <span class="text-sm font-semibold text-slate-700">Filtros</span>
                            <button v-if="activeFilterCount > 0"
                                class="text-xs text-violet-500 hover:text-violet-700 transition-colors underline underline-offset-2"
                                @click="clearAll">
                                Limpiar ({{ activeFilterCount }})
                            </button>
                        </div>

                        <!-- Level -->
                        <div class="mb-8">
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Nivel</p>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="level in levels" :key="level"
                                    class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all hover:scale-105"
                                    :class="selectedLevels.includes(level)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer'"
                                    @click="toggleFilter(selectedLevels, level)">
                                    {{ level }}
                                </button>
                            </div>
                        </div>

                        <!-- Duration -->
                        <div class="mb-8">
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Duración</p>
                            <div class="flex flex-col gap-2">
                                <button v-for="d in durations" :key="d.key"
                                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs border-2 transition-all text-left"
                                    :class="selectedDurations.includes(d.key)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer'"
                                    @click="toggleFilter(selectedDurations, d.key)">
                                    <span class="font-medium">{{ d.label }}</span>
                                    <span class="opacity-60">{{ d.hint }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Genre -->
                        <div>
                            <p class="text-xs uppercase tracking-widest text-slate-400 mb-3">Género</p>
                            <div class="flex flex-col gap-1.5">
                                <button v-for="genre in genres" :key="genre"
                                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs border-2 transition-all text-left capitalize"
                                    :class="selectedGenres.includes(genre)
                                        ? 'bg-slate-700 text-white border-slate-700'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 cursor-pointer'"
                                    @click="toggleFilter(selectedGenres, genre)">
                                    <span class="w-2 h-2 rounded-full shrink-0"
                                        :class="selectedGenres.includes(genre) ? 'bg-white' : 'bg-violet-200'" />
                                    {{ genre }}
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

                <!-- Stories grid -->
                <div class="flex-1">

                    <div class="flex flex-wrap items-center gap-3 mb-6" style="font-family: system-ui, sans-serif;">
                        <p class="text-sm text-slate-500 shrink-0">
                            Mostrando <span class="font-semibold text-slate-700">{{ paginatedStories.length }}</span> de
                            <span class="font-semibold text-slate-700">{{ filteredStories.length }}</span> historias
                        </p>
                        <div class="relative flex-1">
                            <input v-model="search" type="text" placeholder="Buscar por título…"
                                class="w-full px-4 py-2.5 pl-10 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all" />
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="level in selectedLevels" :key="'l' + level"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-white">
                                {{ level }} <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedLevels, level)">×</button>
                            </span>
                            <span v-for="d in selectedDurations" :key="'d' + d"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-700 text-white capitalize">
                                {{ d }} <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedDurations, d)">×</button>
                            </span>
                            <span v-for="g in selectedGenres" :key="'g' + g"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-violet-500 text-white capitalize">
                                {{ g }} <button class="ml-1 hover:opacity-70"
                                    @click="toggleFilter(selectedGenres, g)">×</button>
                            </span>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div v-if="paginatedStories.length > 0" class="flex flex-col gap-4">
                        <NuxtLink v-for="story in paginatedStories" :key="story.slug" :to="`/stories/${story.slug}`"
                            class="group rounded-3xl p-6 border-2 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-xl flex flex-row items-center gap-6"
                            :class="getGenreColors(story.genre).color">
                            <span class="text-4xl shrink-0">{{ story.emoji }}</span>

                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <span
                                        class="text-xs font-medium px-2 py-0.5 rounded-full capitalize bg-white/70 text-slate-500"
                                        style="font-family: system-ui, sans-serif;">{{ story.genre }}</span>
                                    <span class="text-xs font-bold px-3 py-1 rounded-full"
                                        :class="getGenreColors(story.genre).badge"
                                        style="font-family: system-ui, sans-serif;">{{ story.level }}</span>
                                </div>
                                <h3
                                    class="text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors mb-1">
                                    {{ story.title }}</h3>
                                <p class="text-xs text-slate-500 leading-relaxed line-clamp-2"
                                    style="font-family: system-ui, sans-serif;">{{ story.description }}</p>
                            </div>

                            <div class="shrink-0 flex flex-col items-end gap-3 w-32">
                                <div class="flex gap-1 w-full">
                                    <div v-for="dot in 6" :key="dot" class="h-1.5 flex-1 rounded-full transition-all"
                                        :class="dot <= (levelDots[story.level] ?? 1) ? getGenreColors(story.genre).accent : 'bg-white/60'" />
                                </div>
                                <div class="flex flex-col items-end gap-1 text-xs text-slate-400"
                                    style="font-family: system-ui, sans-serif;">
                                    <span>🕐 {{ story.minutes }} min</span>
                                    <span>📝 {{ story.wordCount }} palabras</span>
                                </div>
                                <span
                                    class="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Leer
                                    →</span>
                            </div>

                        </NuxtLink>
                    </div>

                    <!-- Pagination -->
                    <UPagination v-if="filteredStories.length > 0" v-model:page="currentPage"
                        :total="filteredStories.length" :items-per-page="PER_PAGE" class="mt-8 justify-center"
                        :sibling-count="5" show-edges variant="subtle" active-color="info" :ui="{
                            item: 'cursor-pointer px-1',
                            ellipsis: 'px-1',
                            label: 'cursor-pointer px-1',
                            prev: 'cursor-pointer px-1',
                            next: 'cursor-pointer px-1',
                            first: 'cursor-pointer px-1',
                            last: 'cursor-pointer px-1',
                        }" />
                    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
                        <p class="text-5xl mb-4">🔍</p>
                        <h3 class="text-xl font-bold text-slate-700 mb-2">Sin resultados</h3>
                        <p class="text-sm text-slate-400 mb-6">No encontramos historias con esos filtros. Probá con
                            otros.</p>
                        <button
                            class="px-6 py-3 rounded-2xl bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-all"
                            @click="clearAll">
                            Limpiar filtros
                        </button>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>