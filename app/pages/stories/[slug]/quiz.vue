<script setup lang="ts">
interface MCQuestion {
    type: 'multiple_choice'
    question: string
    options: string[]
    answer: number
}

interface WOQuestion {
    type: 'word_order'
    question: string
    words: string[]
    answer: string[]
}

type Question = MCQuestion | WOQuestion

// ─── Load story ───────────────────────────────────────────────────────────────

const route = useRoute()
const slug = route.params.slug as string

const { data: storyData } = await useAsyncData(slug + '-quiz', () =>
    import(`@/data/stories/${slug}.json`)
)

const storyTitle = computed(() => storyData.value?.title ?? '')
const questions = computed<Question[]>(() => storyData.value?.quiz?.questions ?? [])

// ─── Quiz state ───────────────────────────────────────────────────────────────

const currentIndex = ref(0)
const answers = ref<(number | string[] | null)[]>(questions.value.map(() => null))
const submitted = ref(false)
const quizDone = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const isLast = computed(() => currentIndex.value === questions.value.length - 1)

// ─── Multiple choice ──────────────────────────────────────────────────────────

function selectMC(i: number) {
    if (submitted.value) return
    answers.value[currentIndex.value] = i
}

// ─── Word order ───────────────────────────────────────────────────────────────

const woAvailable = ref<string[]>([])
const woSelected = ref<string[]>([])

watch(currentIndex, () => {
    submitted.value = false
    const q = currentQuestion.value
    if (q.type === 'word_order') {
        const existing = answers.value[currentIndex.value] as string[] | null
        if (existing) {
            woSelected.value = [...existing]
            woAvailable.value = []
        } else {
            woSelected.value = []
            woAvailable.value = [...q.words]
        }
    }
}, { immediate: true })

function addWord(word: string, idx: number) {
    if (submitted.value) return
    woAvailable.value.splice(idx, 1)
    woSelected.value.push(word)
    answers.value[currentIndex.value] = [...woSelected.value]
}

function removeWord(word: string, idx: number) {
    if (submitted.value) return
    woSelected.value.splice(idx, 1)
    woAvailable.value.push(word)
    answers.value[currentIndex.value] = woSelected.value.length ? [...woSelected.value] : null
}

// ─── Submit / Next ────────────────────────────────────────────────────────────

const currentAnswer = computed(() => answers.value[currentIndex.value])
const canSubmit = computed(() => currentAnswer.value !== null)

function submitAnswer() {
    submitted.value = true
}

function next() {
    if (isLast.value) {
        quizDone.value = true
    } else {
        submitted.value = false
        currentIndex.value++
    }
}

// ─── Result checking ──────────────────────────────────────────────────────────

function isCorrect(index: number): boolean {
    const q = questions.value[index]
    const a = answers.value[index]
    if (q.type === 'multiple_choice') return a === q.answer
    if (q.type === 'word_order') return (a as string[])?.join(' ') === q.answer.join(' ')
    return false
}

const woCorrectAnswer = computed(() => {
    if (currentQuestion.value?.type === 'word_order') {
        return (currentQuestion.value as WOQuestion).answer.join(' ')
    }
    return ''
})

const woSelectedAnswer = computed(() => woSelected.value.join(' '))

const score = computed(() => answers.value.filter((_, i) => isCorrect(i)).length)
const total = computed(() => questions.value.length)

const scoreLabel = computed(() => {
    const pct = score.value / total.value
    if (pct === 1) return { text: '¡Perfecto!', emoji: '🏆', color: 'text-emerald-600' }
    if (pct >= 0.75) return { text: '¡Muy bien!', emoji: '⭐', color: 'text-amber-500' }
    if (pct >= 0.5) return { text: 'Buen intento', emoji: '📖', color: 'text-blue-500' }
    return { text: 'Seguí practicando', emoji: '💪', color: 'text-rose-500' }
})

// ─── Reset ───────────────────────────────────────────────────────────────────

function resetQuiz() {
    currentIndex.value = 0
    answers.value = questions.value.map(() => null)
    submitted.value = false
    quizDone.value = false
}

// ─── MC answer state ──────────────────────────────────────────────────────────

function mcOptionClass(i: number): string {
    const q = currentQuestion.value as MCQuestion
    const selected = currentAnswer.value === i
    if (!submitted.value) {
        return selected
            ? 'border-slate-700 bg-slate-700 text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 cursor-pointer'
    }
    if (i === q.answer) return 'border-emerald-400 bg-emerald-50 text-emerald-700'
    if (selected && i !== q.answer) return 'border-rose-300 bg-rose-50 text-rose-600'
    return 'border-slate-100 bg-white text-slate-400'
}
</script>

<template>
    <div class="min-h-screen px-6 py-10" style="background: #fefcf9; font-family: 'Georgia', serif;">
        <div class="max-w-xl mx-auto">

            <!-- Back link -->
            <NuxtLink :to="`/stories/${slug}`"
                class="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8"
                style="font-family: system-ui, sans-serif;">
                ← {{ storyTitle }}
            </NuxtLink>

            <!-- No questions -->
            <div v-if="!questions.length" class="flex flex-col items-center justify-center py-24 text-center gap-4">
                <span class="text-5xl">📭</span>
                <h2 class="text-2xl font-bold text-slate-700">No hay preguntas aún</h2>
                <p class="text-slate-400 text-sm" style="font-family: system-ui, sans-serif;">Esta historia todavía no
                    tiene quiz.</p>
            </div>

            <!-- ── QUIZ DONE: Score screen ── -->
            <div v-else-if="quizDone" class="flex flex-col items-center text-center gap-6 py-10">
                <span class="text-7xl">{{ scoreLabel.emoji }}</span>
                <div>
                    <p class="text-xs uppercase tracking-widest text-slate-400 mb-2"
                        style="font-family: system-ui, sans-serif;">Resultado</p>
                    <h1 class="text-5xl font-bold text-slate-800 mb-1" style="letter-spacing: -0.03em;">
                        {{ score }}<span class="text-slate-300">/{{ total }}</span>
                    </h1>
                    <p class="text-xl font-semibold" :class="scoreLabel.color">{{ scoreLabel.text }}</p>
                </div>

                <!-- Per-question summary -->
                <div class="w-full flex flex-col gap-2 mt-4">
                    <div v-for="(q, i) in questions" :key="i"
                        class="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left"
                        :class="isCorrect(i) ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'"
                        style="font-family: system-ui, sans-serif;">
                        <span class="text-lg shrink-0">{{ isCorrect(i) ? '✓' : '✗' }}</span>
                        <p class="text-sm text-slate-700 flex-1">{{ q.question }}</p>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                            :class="isCorrect(i) ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'">{{
                                isCorrect(i) ? 'Correct' : 'Wrong' }}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 mt-2" style="font-family: system-ui, sans-serif;">
                    <NuxtLink :to="`/stories/${slug}`"
                        class="px-6 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 text-sm font-medium hover:border-slate-300 transition-all">
                        ← Volver a la historia
                    </NuxtLink>
                    <button
                        class="px-6 py-3 rounded-2xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer"
                        @click="resetQuiz">
                        Reintentar
                    </button>
                </div>
            </div>

            <!-- ── QUIZ FLOW ── -->
            <div v-else class="flex flex-col gap-6">

                <!-- Progress -->
                <div style="font-family: system-ui, sans-serif;">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-slate-400 uppercase tracking-widest">Pregunta {{ currentIndex + 1 }}
                            de {{ total }}</span>
                        <span class="text-xs text-slate-400">{{ score }} correctas</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-slate-700 rounded-full transition-all duration-500"
                            :style="{ width: `${((currentIndex) / total) * 100}%` }" />
                    </div>
                </div>

                <!-- Question card -->
                <div class="bg-white rounded-3xl border-2 border-slate-100 p-8 flex flex-col gap-6 shadow-sm">

                    <!-- Type badge -->
                    <div class="flex items-center gap-2" style="font-family: system-ui, sans-serif;">
                        <span
                            class="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                            {{ currentQuestion.type === 'multiple_choice' ? 'Multiple choice' : 'Word order' }}
                        </span>
                    </div>

                    <!-- Question text -->
                    <h2 class="text-xl font-bold text-slate-800" style="letter-spacing: -0.02em;">
                        {{ currentQuestion.question }}
                    </h2>

                    <!-- ── Multiple choice options ── -->
                    <div v-if="currentQuestion.type === 'multiple_choice'" class="flex flex-col gap-2"
                        style="font-family: system-ui, sans-serif;">
                        <button v-for="(opt, i) in (currentQuestion as MCQuestion).options" :key="i"
                            class="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all text-sm font-medium"
                            :class="mcOptionClass(i)" @click="selectMC(i)">
                            <span
                                class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0 font-bold"
                                :class="currentAnswer === i ? 'border-current' : 'border-current opacity-40'">{{
                                    ['A', 'B', 'C', 'D'][i] }}</span>
                            {{ opt }}
                        </button>
                    </div>

                    <!-- ── Word order ── -->
                    <div v-if="currentQuestion.type === 'word_order'" class="flex flex-col gap-4"
                        style="font-family: system-ui, sans-serif;">

                        <!-- Drop zone -->
                        <div class="min-h-14 p-3 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 transition-colors"
                            :class="woSelected.length ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-slate-50/50'">
                            <span v-for="(w, i) in woSelected" :key="i"
                                class="px-3 py-1.5 rounded-xl text-sm font-medium border-2 transition-all" :class="submitted
                                    ? woSelectedAnswer === woCorrectAnswer
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-600 border-rose-200'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 cursor-pointer'"
                                @click="removeWord(w, i)">{{ w }}</span>
                            <span v-if="!woSelected.length" class="text-slate-300 text-sm self-center">Tocá las palabras
                                para ordenarlas…</span>
                        </div>

                        <!-- Available words -->
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(w, i) in woAvailable" :key="i"
                                class="px-3 py-1.5 bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-400 rounded-xl text-sm font-medium cursor-pointer transition-all hover:scale-105"
                                @click="addWord(w, i)">{{ w }}</span>
                        </div>

                        <!-- Correct answer shown after submit -->
                        <div v-if="submitted && woSelectedAnswer !== woCorrectAnswer"
                            class="text-sm text-slate-500 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                            ✓ <span class="font-medium text-slate-700">{{ woCorrectAnswer }}</span>
                        </div>

                    </div>

                    <!-- Feedback -->
                    <div v-if="submitted" class="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium"
                        :class="isCorrect(currentIndex) ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'"
                        style="font-family: system-ui, sans-serif;">
                        <span>{{ isCorrect(currentIndex) ? '✓ Correcto' : '✗ Incorrecto' }}</span>
                    </div>

                </div>

                <!-- Actions -->
                <div class="flex justify-between items-center" style="font-family: system-ui, sans-serif;">
                    <span class="text-xs text-slate-400">
                        {{ isLast ? 'Última pregunta' : `${total - currentIndex - 1} preguntas restantes` }}
                    </span>
                    <div class="flex gap-2">
                        <button v-if="!submitted" :disabled="!canSubmit"
                            class="px-6 py-3 rounded-2xl bg-slate-800 text-white text-sm font-medium transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700"
                            @click="submitAnswer">
                            Confirmar →
                        </button>
                        <button v-else
                            class="px-6 py-3 rounded-2xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-all cursor-pointer"
                            @click="next">
                            {{ isLast ? 'Ver resultado →' : 'Siguiente →' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>