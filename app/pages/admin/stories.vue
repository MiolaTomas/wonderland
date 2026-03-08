<template>
    <div class="min-h-screen bg-stone-50 dark:bg-stone-950">

        <!-- Header -->
        <div
            class="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-xl">✦</span>
                <span class="font-serif italic text-lg text-stone-800 dark:text-stone-100">Wonderland</span>
                <UBadge color="neutral" variant="subtle" size="sm" class="font-mono tracking-widest uppercase text-xs">
                    Story Backoffice
                </UBadge>
            </div>
            <span class="text-xs font-mono text-stone-400 dark:text-stone-500">Cmd+Enter to process</span>
        </div>

        <!-- Step tabs -->
        <div class="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 flex gap-6">
            <button v-for="(step, i) in steps" :key="i" @click="currentStep = i" :class="[
                'py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors',
                currentStep === i
                    ? 'border-stone-800 dark:border-stone-100 text-stone-800 dark:text-stone-100'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
            ]">
                {{ i + 1 }}. {{ step }}
            </button>
        </div>

        <!-- STEP 1: Story -->
        <div v-if="currentStep === 0" class="grid grid-cols-2 h-[calc(100vh-113px)]">

            <div class="flex flex-col gap-4 p-6 border-r border-stone-200 dark:border-stone-800 overflow-y-auto">
                <p class="text-xs font-mono uppercase tracking-widest text-stone-400">Metadata</p>

                <div class="grid grid-cols-2 gap-3">
                    <UFormField label="Title">
                        <UInput v-model="form.title" placeholder="The Lost Key…" @input="autoSlug" class="w-full" />
                    </UFormField>
                    <UFormField label="Slug">
                        <UInput v-model="form.slug" placeholder="the-lost-key" class="w-full font-mono text-sm">
                            <template #trailing>
                                <span class="text-stone-400 text-xs font-mono">.json</span>
                            </template>
                        </UInput>
                    </UFormField>
                </div>

                <div class="grid grid-cols-3 gap-3">
                    <UFormField label="Level">
                        <USelect v-model="form.level" :items="levels" class="w-full" />
                    </UFormField>
                    <UFormField label="Genre">
                        <USelect v-model="form.genre" :items="genres" class="w-full" />
                    </UFormField>
                    <UFormField label="Duration">
                        <USelect v-model="form.duration" :items="durations" class="w-full" />
                    </UFormField>
                </div>

                <UFormField label="Emoji">
                    <div class="flex items-center gap-3">
                        <input v-model="form.emoji" placeholder="🗝️" type="text" inputmode="text"
                            class="w-full px-3 py-2 text-2xl rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 text-center" />
                        <span class="text-4xl shrink-0">{{ form.emoji || '?' }}</span>
                    </div>
                </UFormField>

                <UFormField label="Short description">
                    <UTextarea v-model="form.description" placeholder="A short story about…" :rows="2"
                        class="w-full text-sm" />
                </UFormField>

                <USeparator />

                <UFormField label="Story text">
                    <UTextarea v-model="form.text" placeholder="Paste the full story here…" :rows="10"
                        class="w-full text-sm leading-relaxed" @keydown.meta.enter="processStory"
                        @keydown.ctrl.enter="processStory" />
                </UFormField>

                <UButton :loading="loading" :disabled="!form.text.trim()" icon="i-heroicons-arrow-right" trailing
                    @click="processStory" class="self-start" color="neutral">
                    Process Story
                </UButton>
            </div>

            <!-- RIGHT: preview -->
            <div class="flex flex-col gap-4 p-6 bg-stone-100 dark:bg-stone-900 overflow-y-auto">
                <div v-if="!processed" class="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
                    <span class="font-serif italic text-7xl text-stone-400">W</span>
                    <span class="text-xs font-mono uppercase tracking-widest text-stone-400">Paste a story and click
                        Process</span>
                </div>

                <template v-else>
                    <div class="flex items-center justify-between">
                        <p class="text-xs font-mono uppercase tracking-widest text-stone-400">
                            {{ wordCount }} words · ~{{ readingMinutes }} min read
                        </p>
                        <UButton size="xs" color="neutral" variant="outline" icon="i-heroicons-arrow-right" trailing
                            @click="currentStep = 1">
                            Add Dictionary
                        </UButton>
                    </div>
                    <div
                        class="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 overflow-auto flex-1">
                        <p class="text-sm leading-loose text-stone-700 dark:text-stone-300">{{ words.join(' ') }}</p>
                    </div>
                </template>
            </div>
        </div>

        <!-- STEP 2: Dictionary -->
        <div v-if="currentStep === 1" class="grid grid-cols-2 h-[calc(100vh-113px)]">

            <div class="flex flex-col gap-4 p-6 border-r border-stone-200 dark:border-stone-800 overflow-y-auto">
                <p class="text-xs font-mono uppercase tracking-widest text-stone-400">Add dictionary entries</p>

                <div class="flex flex-col gap-3">
                    <UFormField label="Word">
                        <UInput v-model="dictEntry.word" placeholder="outskirts" class="w-full"
                            @keydown.enter="focusTranslation" ref="wordInput" />
                    </UFormField>
                    <UFormField label="Translation (ES)">
                        <UInput v-model="dictEntry.translation" placeholder="afueras" class="w-full"
                            ref="translationInput" @keydown.enter="focusExample" />
                    </UFormField>
                    <UFormField label="Example sentence">
                        <UInput v-model="dictEntry.example" placeholder="She lived on the outskirts of the city."
                            class="w-full" ref="exampleInput" @keydown.enter="addEntry" />
                    </UFormField>
                    <UButton :disabled="!dictEntry.word.trim() || !dictEntry.translation.trim()" icon="i-heroicons-plus"
                        @click="addEntry" color="neutral" class="self-start">
                        Add Entry
                    </UButton>
                </div>

                <USeparator v-if="dictionary.length" />

                <div v-if="dictionary.length" class="flex flex-col gap-2">
                    <p class="text-xs font-mono uppercase tracking-widest text-stone-400">{{ dictionary.length }}
                        entries</p>
                    <div v-for="(entry, i) in dictionary" :key="i"
                        class="flex items-start justify-between bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-4 py-3">
                        <div>
                            <span class="text-sm font-medium text-stone-800 dark:text-stone-100">{{ entry.word }}</span>
                            <span class="text-stone-400 mx-2">→</span>
                            <span class="text-sm text-stone-600 dark:text-stone-300">{{ entry.translation }}</span>
                            <p v-if="entry.example" class="text-xs text-stone-400 mt-0.5 italic">{{ entry.example }}</p>
                        </div>
                        <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-trash"
                            @click="removeEntry(i)" />
                    </div>
                </div>
            </div>

            <!-- RIGHT: final JSON -->
            <div class="flex flex-col gap-4 p-6 bg-stone-100 dark:bg-stone-900 overflow-y-auto">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-folder" class="text-stone-400 text-sm" />
                        <span class="text-xs font-mono text-stone-400">data/stories/</span>
                        <span class="text-xs font-mono font-medium text-stone-700 dark:text-stone-200">{{ form.slug ||
                            'story'
                        }}.json</span>
                    </div>
                    <UButton :icon="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                        :color="copied ? 'success' : 'neutral'" variant="ghost" size="xs"
                        :label="copied ? 'Copied!' : 'Copy JSON'" @click="copyJSON" />
                </div>

                <div class="bg-stone-900 dark:bg-stone-950 rounded-lg border border-stone-700 p-4 overflow-auto flex-1">
                    <pre class="text-xs font-mono leading-relaxed text-stone-300 whitespace-pre">{{ finalJSON }}</pre>
                </div>

                <!-- index.json entry -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-folder" class="text-stone-400 text-sm" />
                            <span class="text-xs font-mono text-stone-400">data/stories/</span>
                            <span class="text-xs font-mono font-medium text-stone-700 dark:text-stone-200">index.json
                                entry</span>
                        </div>
                        <UButton :icon="copiedIndex ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                            :color="copiedIndex ? 'success' : 'neutral'" variant="ghost" size="xs"
                            :label="copiedIndex ? 'Copied!' : 'Copy entry'" @click="copyIndexEntry" />
                    </div>
                    <div
                        class="bg-stone-900 dark:bg-stone-950 rounded-lg border border-stone-700 p-4 overflow-auto max-h-48">
                        <pre
                            class="text-xs font-mono leading-relaxed text-stone-300 whitespace-pre">{{ indexEntry }}</pre>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
definePageMeta({ layout: false })

const steps = ['Story', 'Dictionary']
const currentStep = ref(0)

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const genres = ['adventure', 'mystery', 'romance', 'sci-fi', 'fantasy', 'horror', 'drama', 'comedy', 'thriller', 'historical']
const durations = ['corta', 'media', 'larga']
const emojiOptions = ['🗝️', '📖', '🌧️', '✉️', '📚', '🌿', '⭐', '🌉', '🧊', '☂️', '⏰', '🌍', '🪑', '🦊', '📡', '🎒', '🔍', '🏰', '🌙', '🔥', '💀', '🗺️', '🧪', '🎭', '🌊', '🏔️', '🦋', '🕯️', '🧭', '💫']

const form = reactive({
    title: '', slug: '', level: 'B1', genre: 'adventure',
    duration: 'media', emoji: '', description: '', text: '',
})

const loading = ref(false)
const processed = ref(false)
const copied = ref(false)
const copiedIndex = ref(false)
const words = ref([])
const wordCount = ref(0)

const dictEntry = reactive({ word: '', translation: '', example: '' })
const dictionary = ref([])

const wordInput = ref(null)
const translationInput = ref(null)
const exampleInput = ref(null)

// ─── Auto slug ────────────────────────────────────────────────────────────────

function autoSlug() {
    form.slug = form.title.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

// ─── Reading time ─────────────────────────────────────────────────────────────

const readingMinutes = computed(() => Math.ceil(wordCount.value / 200))

// ─── Process story ────────────────────────────────────────────────────────────

function processStory() {
    if (!form.text.trim()) return
    loading.value = true
    setTimeout(() => {
        const normalized = form.text.trim()
            .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // normalize smart quotes to straight apostrophe
        const tokens = normalized.match(/\b\w+'\w+\b|\w+|[^\w\s]/g) ?? []
        words.value = tokens
        wordCount.value = tokens.filter(t => /\w/.test(t)).length
        processed.value = true
        loading.value = false
    }, 80)
}

// ─── Dictionary ───────────────────────────────────────────────────────────────

function addEntry() {
    if (!dictEntry.word.trim() || !dictEntry.translation.trim()) return
    dictionary.value.push({
        word: dictEntry.word.trim(),
        translation: dictEntry.translation.trim(),
        example: dictEntry.example.trim(),
    })
    dictEntry.word = ''; dictEntry.translation = ''; dictEntry.example = ''
    nextTick(() => wordInput.value?.input?.focus())
}

function removeEntry(i) { dictionary.value.splice(i, 1) }
function focusTranslation() { nextTick(() => translationInput.value?.input?.focus()) }
function focusExample() { nextTick(() => exampleInput.value?.input?.focus()) }

// ─── Final JSON (story file) ──────────────────────────────────────────────────

const finalJSON = computed(() => {
    const dictObj = {}
    dictionary.value.forEach(e => {
        dictObj[e.word] = {
            translation: e.translation,
            ...(e.example && { example: e.example }),
        }
    })
    return JSON.stringify({
        title: form.title || 'Untitled',
        slug: form.slug || 'story',
        level: form.level,
        genre: form.genre,
        duration: form.duration,
        emoji: form.emoji,
        description: form.description,
        wordCount: wordCount.value,
        minutes: readingMinutes.value,
        createdAt: new Date().toISOString().slice(0, 10),
        words: words.value,
        dictionary: dictObj,
    }, null, 2)
})

// ─── Index.json entry (just metadata, no words/dictionary) ───────────────────

const indexEntry = computed(() => {
    return JSON.stringify({
        title: form.title || 'Untitled',
        slug: form.slug || 'story',
        level: form.level,
        genre: form.genre,
        duration: form.duration,
        emoji: form.emoji,
        description: form.description,
        wordCount: wordCount.value,
        minutes: readingMinutes.value,
    }, null, 2)
})

// ─── Copy ─────────────────────────────────────────────────────────────────────

async function copyJSON() {
    await navigator.clipboard.writeText(finalJSON.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}

async function copyIndexEntry() {
    await navigator.clipboard.writeText(indexEntry.value)
    copiedIndex.value = true
    setTimeout(() => { copiedIndex.value = false }, 2000)
}
</script>