<script setup lang="ts">
import { ref, computed } from 'vue'

const previewWords = [
    { text: 'Late', pos: 'adjective', ipa: '/leɪt/', definition: 'Que ocurre después del tiempo esperado.', color: 'bg-amber-100 text-amber-600', ring: 'ring-amber-300', detailBg: 'bg-amber-50 border-amber-200' },
    { text: 'at', pos: 'preposition', ipa: '/æt/', definition: 'Indica posición o tiempo.', color: 'bg-purple-100 text-purple-500', ring: 'ring-purple-300', detailBg: 'bg-purple-50 border-purple-200' },
    { text: 'night', pos: 'noun', ipa: '/naɪt/', definition: 'El período de oscuridad entre el atardecer y el amanecer.', color: 'bg-rose-100 text-rose-500', ring: 'ring-rose-300', detailBg: 'bg-rose-50 border-rose-200' },
    { text: 'Daniel', pos: 'proper noun', ipa: '/ˈdænjəl/', definition: 'Nombre propio masculino de origen hebreo.', color: 'bg-pink-100 text-pink-500', ring: 'ring-pink-300', detailBg: 'bg-pink-50 border-pink-200' },
    { text: 'walked', pos: 'verb', ipa: '/wɔːkt/', definition: 'Se movió a un ritmo regular levantando y bajando los pies.', color: 'bg-sky-100 text-sky-500', ring: 'ring-sky-300', detailBg: 'bg-sky-50 border-sky-200' },
    { text: 'slowly', pos: 'adverb', ipa: '/ˈsloʊli/', definition: 'A una velocidad baja, sin prisa.', color: 'bg-amber-100 text-amber-500', ring: 'ring-amber-300', detailBg: 'bg-amber-50 border-amber-200' },
]

const selectedPreviewIndex = ref(2)
const currentPreviewWord = computed(() => previewWords[selectedPreviewIndex.value] ?? previewWords[0])

const { speak } = useSpeech()

const stories = [
    { title: 'The Midnight Key', level: 'A2', time: '3 min', words: 67, newWords: 12, emoji: '🗝️', desc: 'Una mujer encuentra una misteriosa llave bajo un viejo roble que lo cambia todo.', color: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-500', accent: 'bg-rose-200' },
    { title: 'A Walk in the Rain', level: 'A1', time: '2 min', words: 48, newWords: 8, emoji: '🌧️', desc: 'Un tranquilo paseo de tarde se convierte en un momento de alegría inesperada.', color: 'bg-sky-50 border-sky-200', badge: 'bg-sky-100 text-sky-500', accent: 'bg-sky-200' },
    { title: 'The Last Letter', level: 'B1', time: '5 min', words: 112, newWords: 24, emoji: '✉️', desc: 'Una carta encontrada en un cajón olvidado revela un secreto guardado por décadas.', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-600', accent: 'bg-amber-200' },
    { title: 'Voices in the Library', level: 'B2', time: '7 min', words: 158, newWords: 31, emoji: '📚', desc: 'De noche, un bibliotecario escucha voces provenientes de la sección restringida.', color: 'bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-500', accent: 'bg-violet-200' },
    { title: 'The Glass Garden', level: 'B1', time: '4 min', words: 98, newWords: 19, emoji: '🌿', desc: 'Un jardín escondido hecho enteramente de vidrio guarda las respuestas a un viejo misterio.', color: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-500', accent: 'bg-teal-200' },
    { title: 'Stars Over the City', level: 'C1', time: '8 min', words: 201, newWords: 38, emoji: '⭐', desc: 'Una astrónoma descubre un patrón en las estrellas que nadie había visto antes.', color: 'bg-lime-50 border-lime-200', badge: 'bg-lime-100 text-lime-600', accent: 'bg-lime-200' },
]

const levelDots: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 }

const steps = [
    { number: '01', emoji: '📖', title: 'Pick a story', desc: 'Choose from our library of carefully crafted English stories, sorted by difficulty.' },
    { number: '02', emoji: '🎨', title: 'Read & explore', desc: 'Every word is color-coded by its grammar role. Click any word to go deeper.' },
    { number: '03', emoji: '🔊', title: 'Hear & understand', desc: 'Listen to pronunciation, read the definition in Spanish, and see it used in context.' },
]
</script>

<template>
    <div class="min-h-screen overflow-x-hidden w-full" style="background: #fefcf9; font-family: 'Georgia', serif;">



        <!-- Hero — asymmetric split layout -->
        <section class="relative z-10 max-w-6xl mx-auto px-8 pt-8 pb-12">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

                <!-- Left: 3 cols -->
                <div class="lg:col-span-3">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border"
                        style="font-family: system-ui, sans-serif; background: #fff7ed; border-color: #fed7aa; color: #c2410c;">
                        🎉 Nuevas historias cada semana
                    </div>

                    <h1 class="font-bold text-slate-800 mb-4"
                        style="font-size: clamp(2rem, 4.5vw, 3.8rem); line-height: 1.05; letter-spacing: -0.03em;">
                        Aprendé inglés<br />
                        de la forma <span class="relative">
                            <span class="relative z-10">divertida</span>
                            <span class="absolute bottom-1 left-0 w-full h-4 rounded-full opacity-40 -z-0"
                                style="background: #fde68a;"></span>
                        </span> —<br />
                        a través de <span class="italic font-normal text-violet-400">historias.</span>
                    </h1>

                    <p class="text-lg text-slate-500 leading-relaxed mb-6 max-w-lg"
                        style="font-family: system-ui, sans-serif;">
                        Hacé clic en cualquier palabra para ver su significado, función gramatical y pronunciación —
                        todo explicado en español. Sin registro, sin costo.
                    </p>

                    <div class="flex flex-wrap items-center gap-4">
                        <a href="/reader"
                            class="px-8 py-4 rounded-2xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 transition-all hover:scale-105 shadow-lg shadow-slate-200"
                            style="font-family: system-ui, sans-serif;">
                            Abrir una historia →
                        </a>
                        <div class="flex items-center gap-2" style="font-family: system-ui, sans-serif;">
                            <div class="flex -space-x-2">
                                <div
                                    class="w-8 h-8 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-xs">
                                    😊</div>
                                <div
                                    class="w-8 h-8 rounded-full bg-sky-200 border-2 border-white flex items-center justify-center text-xs">
                                    🙂</div>
                                <div
                                    class="w-8 h-8 rounded-full bg-lime-200 border-2 border-white flex items-center justify-center text-xs">
                                    😄</div>
                            </div>
                            <span class="text-sm text-slate-400">+500 estudiantes</span>
                        </div>
                    </div>
                </div>

                <!-- Right: 2 cols — stacked cards -->
                <div class="lg:col-span-2 flex flex-col gap-4">

                    <!-- Interactive preview card -->
                    <div
                        class="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-6 relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 -translate-y-8 translate-x-8"
                            style="background: radial-gradient(circle, #c4b5fd, transparent);">
                        </div>
                        <p class="text-xs text-slate-400 uppercase tracking-widest mb-4"
                            style="font-family: system-ui, sans-serif;">
                            📖 The Midnight Key · <span class="text-violet-300">¡hacé clic en una palabra!</span>
                        </p>

                        <!-- Clickable words -->
                        <div class="leading-loose mb-4">
                            <span v-for="(word, i) in previewWords" :key="i"
                                class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 cursor-pointer transition-all hover:scale-105 ring-offset-1"
                                :class="[word.color, selectedPreviewIndex === i ? `ring-2 ${word.ring}` : '']"
                                @click="selectedPreviewIndex = i">
                                {{ word.text }}
                            </span>
                        </div>

                        <!-- Dynamic detail panel -->
                        <div class="rounded-2xl p-4 border transition-all" :class="currentPreviewWord.detailBg">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="px-2 py-1 rounded-lg text-sm font-bold" :class="currentPreviewWord.color">
                                    {{ currentPreviewWord.text }}
                                </span>
                                <span class="text-xs text-slate-400" style="font-family: system-ui, sans-serif;">
                                    {{ currentPreviewWord.pos }} · {{ currentPreviewWord.ipa }}
                                </span>
                                <span class="ml-auto text-base cursor-pointer hover:scale-110 transition-transform"
                                    @click="speak(currentPreviewWord.text)">🔊</span>
                            </div>
                            <p class="text-xs text-slate-500 leading-relaxed"
                                style="font-family: system-ui, sans-serif;">
                                {{ currentPreviewWord.definition }}
                            </p>
                        </div>
                    </div>

                    <!-- Mini stats card -->
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-violet-50 rounded-2xl p-4 border border-violet-100 text-center">
                            <p class="text-2xl font-bold text-violet-600" style="letter-spacing: -0.02em;">12</p>
                            <p class="text-xs text-violet-400" style="font-family: system-ui, sans-serif;">Stories</p>
                        </div>
                        <div class="bg-pink-100 rounded-2xl p-4 border border-pink-100 text-center">
                            <p class="text-2xl font-bold text-pink-500" style="letter-spacing: -0.02em;">1.4k</p>
                            <p class="text-xs text-pink-400" style="font-family: system-ui, sans-serif;">Words</p>
                        </div>
                        <div class="bg-sky-100 rounded-2xl p-4 border border-sky-100 text-center">
                            <p class="text-2xl font-bold text-sky-500" style="letter-spacing: -0.02em;">A1-C1</p>
                            <p class="text-xs text-sky-400" style="font-family: system-ui, sans-serif;">Levels</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- How it works — alternating layout -->
        <section id="how" class="relative z-10 py-20 w-full"
            style="background: linear-gradient(180deg, #fefcf9 0%, #f5f0ff 100%);">
            <div class="max-w-5xl mx-auto px-8">
                <div class="text-center mb-20">
                    <p class="text-xs uppercase tracking-widest text-slate-400 mb-3"
                        style="font-family: system-ui, sans-serif;">La experiencia</p>
                    <h2 class="text-4xl font-bold text-slate-800" style="letter-spacing: -0.02em;">Cómo funciona</h2>
                </div>

                <!-- Step 1 -->
                <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
                    <div class="flex-1 order-2 md:order-1">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 bg-rose-100 text-rose-500"
                            style="font-family: system-ui, sans-serif;">
                            Paso 1
                        </div>
                        <h3 class="text-3xl font-bold text-slate-800 mb-4" style="letter-spacing: -0.02em;">Elegí una
                            historia<br />que te llame la atención</h3>
                        <p class="text-slate-500 leading-relaxed" style="font-family: system-ui, sans-serif;">Explorá
                            nuestra biblioteca de historias originales en inglés, organizadas por nivel de dificultad de
                            A1 a C1. Cada una es corta, entretenida y diseñada para exponerte a vocabulario natural.</p>
                    </div>
                    <div class="flex-1 order-1 md:order-2">
                        <div class="bg-white rounded-3xl p-6 border border-rose-100 shadow-lg shadow-rose-50">
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                                    <span class="text-2xl block mb-2">🗝️</span>
                                    <p class="text-sm font-bold text-slate-700">The Midnight Key</p>
                                    <span
                                        class="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full mt-1 inline-block"
                                        style="font-family: system-ui, sans-serif;">A2</span>
                                </div>
                                <div class="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                                    <span class="text-2xl block mb-2">🌧️</span>
                                    <p class="text-sm font-bold text-slate-700">A Walk in the Rain</p>
                                    <span
                                        class="text-xs bg-sky-100 text-sky-500 px-2 py-0.5 rounded-full mt-1 inline-block"
                                        style="font-family: system-ui, sans-serif;">A1</span>
                                </div>
                                <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                                    <span class="text-2xl block mb-2">✉️</span>
                                    <p class="text-sm font-bold text-slate-700">The Last Letter</p>
                                    <span
                                        class="text-xs bg-amber-100 text-amber-500 px-2 py-0.5 rounded-full mt-1 inline-block"
                                        style="font-family: system-ui, sans-serif;">B1</span>
                                </div>
                                <div class="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                                    <span class="text-2xl block mb-2">📚</span>
                                    <p class="text-sm font-bold text-slate-700">Voices in the Library</p>
                                    <span
                                        class="text-xs bg-violet-100 text-violet-500 px-2 py-0.5 rounded-full mt-1 inline-block"
                                        style="font-family: system-ui, sans-serif;">B2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="flex flex-col md:flex-row items-center gap-12 mb-20">
                    <div class="flex-1">
                        <div class="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg shadow-violet-50">
                            <p class="text-xs text-slate-400 uppercase tracking-widest mb-4"
                                style="font-family: system-ui, sans-serif;">📖 The Midnight Key</p>
                            <div class="leading-loose mb-4">
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-amber-100 text-amber-600">Late</span>
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-slate-100 text-slate-500">at</span>
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-rose-100 text-rose-500 ring-2 ring-rose-300 ring-offset-1 cursor-pointer">night</span>
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-pink-100 text-pink-500">Daniel</span>
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-sky-100 text-sky-500">walked</span>
                                <span
                                    class="inline-flex px-2 py-0.5 rounded-lg text-xs mx-0.5 bg-amber-100 text-amber-500">slowly</span>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-3" style="font-family: system-ui, sans-serif;">
                                <span class="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-500">noun</span>
                                <span class="text-xs px-2 py-1 rounded-full bg-sky-100 text-sky-500">verb</span>
                                <span
                                    class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-500">adjective</span>
                                <span class="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-500">adverb</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 bg-violet-100 text-violet-500"
                            style="font-family: system-ui, sans-serif;">
                            Paso 2
                        </div>
                        <h3 class="text-3xl font-bold text-slate-800 mb-4" style="letter-spacing: -0.02em;">Leé — cada
                            palabra<br />tiene su color</h3>
                        <p class="text-slate-500 leading-relaxed" style="font-family: system-ui, sans-serif;">Cada
                            palabra está etiquetada según su función gramatical. Sustantivos, verbos, adjetivos,
                            adverbios — todos en colores pastel distintos para que la gramática se vuelva visual e
                            intuitiva mientras leés.</p>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="flex flex-col md:flex-row items-center gap-12">
                    <div class="flex-1 order-2 md:order-1">
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5 bg-teal-100 text-teal-600"
                            style="font-family: system-ui, sans-serif;">
                            Paso 3
                        </div>
                        <h3 class="text-3xl font-bold text-slate-800 mb-4" style="letter-spacing: -0.02em;">Hacé clic en
                            cualquier<br />palabra para ir más fondo</h3>
                        <p class="text-slate-500 leading-relaxed" style="font-family: system-ui, sans-serif;">Tocá una
                            palabra y al instante verás su definición en español, pronunciación IPA y una oración de
                            ejemplo. Apretá el ícono del parlante para escucharla. Aprender nunca fue tan natural.</p>
                    </div>
                    <div class="flex-1 order-1 md:order-2">
                        <div class="bg-white rounded-3xl p-6 border border-teal-100 shadow-lg shadow-teal-50">
                            <div class="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                                <div class="flex items-center gap-2 mb-3">
                                    <span
                                        class="px-2 py-1 rounded-lg bg-rose-100 text-rose-500 text-sm font-bold">night</span>
                                    <span class="text-xs text-slate-400"
                                        style="font-family: system-ui, sans-serif;">noun · /naɪt/</span>
                                    <span class="ml-auto text-lg">🔊</span>
                                </div>
                                <p class="text-sm text-slate-600 mb-3" style="font-family: system-ui, sans-serif;">El
                                    período de oscuridad entre el atardecer y el amanecer.</p>
                                <p class="text-xs text-slate-400 italic" style="font-family: system-ui, sans-serif;">
                                    "She walked home alone in the night."</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- Stories grid -->
        <section id="stories" class="relative z-10 py-24 max-w-6xl mx-auto px-8">
            <div class="flex items-end justify-between mb-12">
                <div>
                    <p class="text-xs uppercase tracking-widest text-slate-400 mb-2"
                        style="font-family: system-ui, sans-serif;">La biblioteca</p>
                    <h2 class="text-4xl font-bold text-slate-800" style="letter-spacing: -0.02em;">Elegí tu historia
                    </h2>
                </div>
                <a href="/stories-list" class="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4"
                    style="font-family: system-ui, sans-serif;">
                    Ver todas →
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <a v-for="(story, i) in stories" :key="i" href="/reader"
                    class="group rounded-3xl p-6 border-2 transition-all cursor-pointer hover:scale-105 hover:shadow-xl flex flex-col"
                    :class="story.color">

                    <!-- Top row: emoji + level badge -->
                    <div class="flex items-start justify-between mb-4">
                        <span class="text-3xl">{{ story.emoji }}</span>
                        <span class="text-xs font-bold px-3 py-1 rounded-full" :class="story.badge"
                            style="font-family: system-ui, sans-serif;">
                            {{ story.level }}
                        </span>
                    </div>

                    <!-- Title & description -->
                    <h3 class="text-lg font-bold text-slate-700 mb-2 group-hover:text-slate-900 transition-colors">{{
                        story.title }}</h3>
                    <p class="text-xs text-slate-500 leading-relaxed mb-4 flex-1"
                        style="font-family: system-ui, sans-serif;">{{ story.desc }}</p>

                    <!-- Difficulty bar -->
                    <div class="mb-4">
                        <div class="flex gap-1">
                            <div v-for="dot in 6" :key="dot" class="h-1.5 flex-1 rounded-full transition-all"
                                :class="dot <= (levelDots[story.level] ?? 1) ? story.accent : 'bg-white/60'">
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between" style="font-family: system-ui, sans-serif;">
                        <div class="flex items-center gap-3 text-xs text-slate-400">
                            <span>🕐 {{ story.time }}</span>
                            <span>📝 {{ story.words }} palabras</span>
                        </div>
                        <span
                            class="text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">Leer
                            →</span>
                    </div>

                </a>
            </div>
        </section>

        <!-- CTA banner -->
        <section class="relative z-10 pb-24 overflow-hidden">

            <!-- Scrolling word ticker -->
            <div class="w-full overflow-hidden mb-0 py-4 border-y border-slate-100" style="background: #fefcf9;">
                <div class="flex gap-3 animate-ticker whitespace-nowrap">
                    <template v-for="_ in 3" :key="_">
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-100 text-rose-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">mysterious</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">wandered</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-violet-100 text-violet-500 shrink-0 font-bold"
                            style="font-family: system-ui, sans-serif;">adventure</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-600 shrink-0"
                            style="font-family: system-ui, sans-serif;">silently</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-teal-100 text-teal-600 shrink-0"
                            style="font-family: system-ui, sans-serif;">enchanted</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-100 text-pink-500 shrink-0 font-bold"
                            style="font-family: system-ui, sans-serif;">whispered</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-lime-100 text-lime-600 shrink-0"
                            style="font-family: system-ui, sans-serif;">ancient</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">glowing</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-100 text-rose-400 shrink-0"
                            style="font-family: system-ui, sans-serif;">forever</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-400 shrink-0 font-bold"
                            style="font-family: system-ui, sans-serif;">curious</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-violet-100 text-violet-400 shrink-0"
                            style="font-family: system-ui, sans-serif;">beneath</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">discovered</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-teal-100 text-teal-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">hidden</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-100 text-pink-400 shrink-0"
                            style="font-family: system-ui, sans-serif;">narrow</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-lime-100 text-lime-500 shrink-0 font-bold"
                            style="font-family: system-ui, sans-serif;">secrets</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-rose-100 text-rose-500 shrink-0"
                            style="font-family: system-ui, sans-serif;">walked</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-100 text-sky-600 shrink-0"
                            style="font-family: system-ui, sans-serif;">noticed</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-violet-100 text-violet-600 shrink-0"
                            style="font-family: system-ui, sans-serif;">faded</span>
                        <span
                            class="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-400 shrink-0 font-bold"
                            style="font-family: system-ui, sans-serif;">softly</span>
                        <span class="px-3 py-1.5 rounded-full text-xs font-medium bg-teal-100 text-teal-400 shrink-0"
                            style="font-family: system-ui, sans-serif;">returned</span>
                    </template>
                </div>
            </div>

            <!-- Main CTA -->
            <div class="relative text-center px-8 pt-20 pb-20"
                style="background: linear-gradient(160deg, #fdf4ff 0%, #ede9fe 35%, #e0f2fe 70%, #f0fdf4 100%);">
                <div class="absolute inset-0 opacity-20"
                    style="background-image: radial-gradient(circle at 15% 50%, #f0abfc 0%, transparent 45%), radial-gradient(circle at 85% 30%, #7dd3fc 0%, transparent 45%), radial-gradient(circle at 50% 90%, #bbf7d0 0%, transparent 40%);">
                </div>
                <div class="relative z-10 max-w-2xl mx-auto">
                    <p class="text-xs uppercase tracking-widest text-violet-400 mb-6"
                        style="font-family: system-ui, sans-serif;">
                        ✦ tu próxima historia te espera ✦
                    </p>
                    <h2 class="font-bold text-slate-800 mb-6"
                        style="font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.05; letter-spacing: -0.03em; font-family: 'Georgia', serif;">
                        Una historia.<br />
                        Cien palabras <span class="italic font-normal text-violet-400">nuevas.</span>
                    </h2>
                    <p class="text-slate-500 leading-relaxed mb-10 max-w-md mx-auto"
                        style="font-family: system-ui, sans-serif;">
                        Sin registro. Sin suscripción. Solo abrí una historia y empezá a descubrir palabras a tu ritmo.
                    </p>
                    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="/reader"
                            class="px-10 py-4 rounded-2xl bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 transition-all hover:scale-105 shadow-xl shadow-slate-200"
                            style="font-family: system-ui, sans-serif;">
                            ✨ Empezar a leer gratis
                        </a>
                        <a href="#stories"
                            class="px-10 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 text-sm font-medium hover:border-slate-300 transition-all bg-white/60"
                            style="font-family: system-ui, sans-serif;">
                            Ver las historias →
                        </a>
                    </div>
                </div>
            </div>

        </section>

    </div>
</template>

<style scoped>
@keyframes ticker {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-33.333%);
    }
}

.animate-ticker {
    animation: ticker 25s linear infinite;
}
</style>