<script setup lang="ts">
// ─── Types ───────────────────────────────────────────────────────────────────

interface WordEntry {
    word: string
    punctuation?: boolean
    ipa?: string
    part_of_speech?: string
    definition_en?: string
    definition_es?: string
    example_en?: string
    example_es?: string
}

interface PosColor {
    bg: string
    text: string
    ring: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const route = useRoute()
const slug = route.params.slug as string

const { data: storyData } = await useAsyncData(slug, () =>
    import(`@/data/stories/${slug}.json`)
)

const story = computed<WordEntry[]>(() => storyData.value?.words ?? [])
const storyTitle = computed<string>(() => storyData.value?.title ?? '')
const storyLevel = computed<string>(() => storyData.value?.level ?? '')
const storyGenre = computed<string>(() => storyData.value?.genre ?? '')

// ─── Composables ─────────────────────────────────────────────────────────────

const { speak } = useSpeech()

// ─── State ───────────────────────────────────────────────────────────────────

const selectedWord = ref<WordEntry | null>(null)
const selectedIndex = ref<number | null>(null)

// ─── Color map ───────────────────────────────────────────────────────────────

const posColorMap: Record<string, PosColor> = {
    noun: { bg: '#fde8eb', text: '#E8445A', ring: '#E8445A' },
    verb: { bg: '#e0f7f6', text: '#2BBCB8', ring: '#2BBCB8' },
    adjective: { bg: '#fef3e0', text: '#F5A623', ring: '#F5A623' },
    adverb: { bg: '#e6f6ec', text: '#4CAF7D', ring: '#4CAF7D' },
    preposition: { bg: '#ede8f5', text: '#7B5EA7', ring: '#7B5EA7' },
    pronoun: { bg: '#fdeee8', text: '#E8612A', ring: '#E8612A' },
    conjunction: { bg: '#f0ecf4', text: '#9B6B9A', ring: '#9B6B9A' },
    article: { bg: '#fdf0fb', text: '#C84BAE', ring: '#C84BAE' },
    determiner: { bg: '#e8f4fd', text: '#2E86C1', ring: '#2E86C1' },
    'proper noun': { bg: '#fde8eb', text: '#E8445A', ring: '#E8445A' },
}

function getColor(pos: string = ''): PosColor {
    return posColorMap[pos.toLowerCase()] ?? { bg: '#f1f5f9', text: '#64748b', ring: '#94a3b8' }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isPunctuation(entry: WordEntry): boolean {
    return entry.punctuation === true
}

function hasDefinition(entry: WordEntry): boolean {
    return !!entry.definition_en || !!entry.definition_es
}

// ─── Reading time ─────────────────────────────────────────────────────────────

const readingTime = computed(() => {
    const words = story.value.filter(w => !isPunctuation(w)).length
    return Math.ceil(words / 200)
})

// ─── Interactions ────────────────────────────────────────────────────────────

function onWordClick(entry: WordEntry, index: number) {
    selectedIndex.value = index
    selectedWord.value = hasDefinition(entry) ? entry : null
}

// ─── Debug ───────────────────────────────────────────────────────────────────

const unmappedPos = computed(() => [...new Set(
    story.value
        .filter(w => w.part_of_speech && !posColorMap[w.part_of_speech.toLowerCase()])
        .map(w => w.part_of_speech)
)])
console.log('Unmapped POS:', unmappedPos.value)
</script>

<template>
    <div class="min-h-screen p-6 md:p-10">
        <div class="max-w-6xl mx-auto">

            <!-- Page header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold tracking-tight">{{ storyTitle }}</h1>
                <div class="flex items-center gap-2 mt-1">
                    <UBadge variant="subtle" class="capitalize">{{ storyLevel }}</UBadge>
                    <UBadge variant="subtle" class="capitalize">{{ storyGenre }}</UBadge>
                    <USeparator orientation="vertical" class="h-4" />
                    <p class="text-muted text-sm">Click any word to explore its definition and grammar.</p>
                    <USeparator orientation="vertical" class="h-4" />
                    <div class="flex items-center gap-1 text-muted text-sm">
                        <UIcon name="lucide:clock" class="w-4 h-4" />
                        <span>{{ readingTime }} min read</span>
                    </div>
                </div>
            </div>

            <!-- Main layout -->
            <div class="flex flex-col md:flex-row gap-6">

                <!-- ── Story panel ── -->
                <UCard class="flex-1 min-w-0">
                    <template #header>
                        <div class="flex items-center gap-2">
                            <UIcon name="lucide:book-open" class="w-4 h-4 text-muted" />
                            <span class="font-semibold text-sm uppercase tracking-widest text-muted">The Story</span>
                        </div>
                    </template>

                    <div class="leading-loose">
                        <template v-for="(entry, index) in story" :key="index">

                            <!-- Puntuación -->
                            <span v-if="isPunctuation(entry)" class="mx-0.5">{{ entry.word }}</span>

                            <!-- Word chip -->
                            <UBadge v-else variant="subtle"
                                class="cursor-pointer mx-0.5 my-0.5 transition-all hover:scale-105 hover:shadow-sm inline-flex text-sm"
                                :style="{
                                    backgroundColor: getColor(entry.part_of_speech).bg,
                                    color: getColor(entry.part_of_speech).text,
                                    boxShadow: selectedIndex === index
                                        ? `0 0 0 2px ${getColor(entry.part_of_speech).ring}`
                                        : 'none',
                                }" @click="onWordClick(entry, index)">
                                {{ entry.word }}
                            </UBadge>

                        </template>
                    </div>
                </UCard>

                <!-- ── Right column ── -->
                <div class="w-full md:w-80 shrink-0">

                    <!-- Detail panel -->
                    <UCard class="sticky top-6">
                        <template #header>
                            <div class="flex items-center gap-2">
                                <UIcon name="lucide:info" class="w-4 h-4 text-muted" />
                                <span class="font-semibold text-sm uppercase tracking-widest text-muted">Word
                                    Details</span>
                            </div>
                        </template>

                        <!-- Empty state -->
                        <div v-if="!selectedWord"
                            class="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <UIcon name="lucide:mouse-pointer-click" class="w-8 h-8 text-muted" />
                            <p class="text-muted text-sm">Select a word to see its details.</p>
                        </div>

                        <!-- Word details -->
                        <div v-else class="space-y-4">

                            <UBadge variant="subtle"
                                class="text-2xl font-bold px-3 py-1.5 rounded-md cursor-pointer inline-flex items-center gap-2 leading-none outline-none"
                                :style="{
                                    backgroundColor: getColor(selectedWord.part_of_speech).bg,
                                    color: getColor(selectedWord.part_of_speech).text,
                                    outline: 'none',
                                    boxShadow: `0 0 0 2px ${getColor(selectedWord.part_of_speech).ring}`,
                                }" @click="speak(selectedWord.word)">
                                {{ selectedWord.word }}
                                <template #trailing>
                                    <UIcon name="lucide:volume-2" class="w-4 h-4 shrink-0 mt-0.5" />
                                </template>
                            </UBadge>

                            <div v-if="selectedWord.ipa">
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Pronunciation</p>
                                <p class="text-sm font-mono">{{ selectedWord.ipa }}</p>
                            </div>

                            <USeparator />

                            <div v-if="selectedWord.definition_en">
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Definition</p>
                                <p class="text-sm leading-relaxed">{{ selectedWord.definition_en }}</p>
                            </div>

                            <div v-if="selectedWord.definition_es">
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Definición</p>
                                <p class="text-sm leading-relaxed">{{ selectedWord.definition_es }}</p>
                            </div>

                            <div v-if="selectedWord.example_en">
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Example</p>
                                <p class="text-sm leading-relaxed italic text-muted">"{{ selectedWord.example_en }}"</p>
                            </div>

                            <div v-if="selectedWord.example_es">
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Ejemplo</p>
                                <p class="text-sm leading-relaxed text-muted">{{ selectedWord.example_es }}</p>
                            </div>

                        </div>
                    </UCard>

                    <!-- Legend -->
                    <UCard class="mt-4">
                        <template #header>
                            <span class="font-semibold text-sm uppercase tracking-widest text-muted">Legend</span>
                        </template>
                        <div class="flex flex-wrap gap-2">
                            <UBadge v-for="(color, pos) in posColorMap" :key="pos" variant="subtle" class="capitalize"
                                :style="{ backgroundColor: color.bg, color: color.text }">
                                {{ pos }}
                            </UBadge>
                        </div>
                    </UCard>

                </div>
            </div>
        </div>
    </div>
</template>
