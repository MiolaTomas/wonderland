<script setup lang="ts">
import { ref } from 'vue'
import storyData from '@/data/story.json'
import dictionaryData from '@/data/dictionary.json'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DictionaryEntry {
    word: string
    ipa: string
    part_of_speech: string
    definition_es: string
    example_en: string
    example_es: string
}

// Each POS color has three values:
//   bg  → background of the chip
//   text → text color of the chip
//   ring → outline color when the word is selected
interface PosColor {
    bg: string
    text: string
    ring: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const story: string[] = storyData.words
const dictionary: DictionaryEntry[] = dictionaryData.words

// ─── Composables ─────────────────────────────────────────────────────────────

// useSpeech is auto-imported by Nuxt from composables/useSpeech.ts
const { speak } = useSpeech()

// ─── State ───────────────────────────────────────────────────────────────────

// The word entry currently shown in the detail panel (null = nothing selected)
const selectedWord = ref<DictionaryEntry | null>(null)

// We track the index (not just the word text) so that clicking one "the"
// doesn't highlight every "the" in the story at the same time
const selectedIndex = ref<number | null>(null)

// ─── Color map ───────────────────────────────────────────────────────────────

// These colors come from the Wonderland logo palette.
// Each key is a part-of-speech string that matches what's in dictionary.json.
const posColorMap: Record<string, PosColor> = {
    noun: { bg: '#fde8eb', text: '#E8445A', ring: '#E8445A' }, // pink-red
    verb: { bg: '#e0f7f6', text: '#2BBCB8', ring: '#2BBCB8' }, // teal
    adjective: { bg: '#fef3e0', text: '#F5A623', ring: '#F5A623' }, // orange
    adverb: { bg: '#e6f6ec', text: '#4CAF7D', ring: '#4CAF7D' }, // green
    preposition: { bg: '#ede8f5', text: '#7B5EA7', ring: '#7B5EA7' }, // purple
    pronoun: { bg: '#fdeee8', text: '#E8612A', ring: '#E8612A' }, // orange-red
    conjunction: { bg: '#f0ecf4', text: '#9B6B9A', ring: '#9B6B9A' }, // mauve
    article: { bg: '#fdf0fb', text: '#C84BAE', ring: '#C84BAE' }, // pink-magenta
    determiner: { bg: '#e8f4fd', text: '#2E86C1', ring: '#2E86C1' }, // blue
    'proper noun': { bg: '#fde8eb', text: '#E8445A', ring: '#E8445A' }, // pink-red (same as noun)
}

// Returns the color object for a given POS string, or a neutral grey fallback
function getColor(pos: string): PosColor {
    return posColorMap[pos.toLowerCase()] ?? { bg: '#f1f5f9', text: '#64748b', ring: '#94a3b8' }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Punctuation tokens should be rendered as plain text, not as clickable chips
function isPunctuation(word: string): boolean {
    return /^[.,!?;:'"()\-—…]+$/.test(word)
}

// Look up a word in the dictionary (case-insensitive)
function getWordData(word: string): DictionaryEntry | undefined {
    return dictionary.find(
        (entry) => entry.word.toLowerCase() === word.toLowerCase()
    )
}

// ─── Reading time ─────────────────────────────────────────────────────────────

// Estimated at 200 words per minute, ignoring punctuation tokens
const readingTime = computed(() => {
    const words = story.filter(word => !isPunctuation(word)).length
    return Math.ceil(words / 200)
})

// ─── Interactions ────────────────────────────────────────────────────────────

function onWordClick(word: string, index: number) {
    selectedIndex.value = index
    selectedWord.value = getWordData(word) ?? null
}

// ─── Debug ───────────────────────────────────────────────────────────────────

// Logs any POS values in the story that don't have a color assigned yet
const unmappedWords = story.filter(word => {
    const pos = getWordData(word)?.part_of_speech?.toLowerCase()
    return pos && !posColorMap[pos]
})
console.log('Unmapped POS:', [...new Set(unmappedWords.map(w => getWordData(w)?.part_of_speech))])
</script>

<template>
    <div class="min-h-screen p-6 md:p-10">
        <div class="max-w-6xl mx-auto">

            <!-- Page header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold tracking-tight">Story Reader</h1>
                <div class="flex items-center gap-2 mt-1">
                    <p class="text-muted">Click any word to explore its definition and grammar.</p>
                    <USeparator orientation="vertical" class="h-4" />
                    <div class="flex items-center gap-1 text-muted text-sm">
                        <UIcon name="lucide:clock" class="w-4 h-4" />
                        <span>{{ readingTime }} min read</span>
                    </div>
                </div>
            </div>

            <!-- Main layout: story on the left, detail panel on the right -->
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
                        <template v-for="(word, index) in story" :key="index">

                            <!-- Punctuation: plain text, no chip -->
                            <span v-if="isPunctuation(word)" class="mx-0.5">{{ word }}</span>

                            <!-- Word chip: colored by POS, clickable -->
                            <!-- We use :style instead of :class because our colors are
                                 custom hex values — Tailwind can't generate classes for them -->
                            <UBadge v-else variant="subtle"
                                class="cursor-pointer mx-0.5 my-0.5 transition-all hover:scale-105 hover:shadow-sm inline-flex text-sm"
                                :style="{
                                    backgroundColor: getColor(getWordData(word)?.part_of_speech ?? '').bg,
                                    color: getColor(getWordData(word)?.part_of_speech ?? '').text,
                                    boxShadow: selectedIndex === index
                                        ? `0 0 0 2px ${getColor(getWordData(word)?.part_of_speech ?? '').ring}`
                                        : 'none',
                                    outline: 'none',
                                }" @click="onWordClick(word, index)">
                                {{ word }}
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

                        <!-- Empty state: no word selected yet -->
                        <div v-if="!selectedWord"
                            class="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <UIcon name="lucide:mouse-pointer-click" class="w-8 h-8 text-muted" />
                            <p class="text-muted text-sm">Select a word to see its details.</p>
                        </div>

                        <!-- Word details: shown when a word is selected -->
                        <div v-else class="space-y-4">

                            <!-- Word + speak button, colored by its POS -->
                            <UBadge variant="subtle"
                                class="text-2xl font-bold px-3 py-1.5 rounded-md cursor-pointer inline-flex items-center gap-2 leading-none"
                                :style="{
                                    backgroundColor: getColor(selectedWord.part_of_speech).bg,
                                    color: getColor(selectedWord.part_of_speech).text,
                                    boxShadow: 'none',
                                }" @click="speak(selectedWord.word)">
                                {{ selectedWord.word }}
                                <template #trailing>
                                    <UIcon name="lucide:volume-2" class="w-4 h-4 shrink-0 mt-0.5" />
                                </template>
                            </UBadge>

                            <div>
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Pronunciation</p>
                                <p class="text-sm font-mono">{{ selectedWord.ipa }}</p>
                            </div>

                            <USeparator />

                            <div>
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Definition</p>
                                <p class="text-sm leading-relaxed">{{ selectedWord.definition_en }}</p>
                            </div>

                            <div>
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Definicion</p>
                                <p class="text-sm leading-relaxed">{{ selectedWord.definition_es }}</p>
                            </div>


                            <div>
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Example</p>
                                <p class="text-sm leading-relaxed italic text-muted">"{{ selectedWord.example_en }}"</p>
                            </div>

                            <div>
                                <p class="text-xs text-muted uppercase tracking-widest mb-1">Ejemplo</p>
                                <p class="text-sm leading-relaxed text-muted">{{ selectedWord.example_es }}</p>
                            </div>

                        </div>
                    </UCard>

                    <!-- Legend: shows all POS colors -->
                    <UCard class="mt-4">
                        <template #header>
                            <span class="font-semibold text-sm uppercase tracking-widest text-muted">Legend</span>
                        </template>
                        <div class="flex flex-wrap gap-2">
                            <UBadge v-for="(color, pos) in posColorMap" :key="pos" variant="subtle" class="capitalize"
                                :style="{
                                    backgroundColor: color.bg,
                                    color: color.text,
                                    boxShadow: 'none',
                                }">
                                {{ pos }}
                            </UBadge>
                        </div>
                    </UCard>

                </div>
            </div>
        </div>
    </div>
</template>