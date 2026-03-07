<script setup lang="ts">
const route = useRoute();
</script>
<template>
    <div>
        <nav class="relative z-10 px-8 py-5 flex items-center justify-between">
            <NuxtLink to="/home">
                <div class="flex items-center gap-2">
                    <span class="text-3xl font-bold"
                        style="letter-spacing: 0.08em; font-family: 'Bubblegum Sans', sans-serif;">
                        <span style="color: #F5A623;">w</span>
                        <span style="color: #E8445A;">o</span>
                        <span style="color: #2BBCB8;">n</span>
                        <span style="color: #4CAF7D;">d</span>
                        <span style="color: #7B5EA7;">e</span>
                        <span style="color: #F5A623;">r</span>
                        <span style="color: #2BBCB8;">l</span>
                        <span style="color: #9B6B9A;">a</span>
                        <span style="color: #E8612A;">n</span>
                        <span style="color: #E8445A;">d</span>
                    </span>
                </div>
            </NuxtLink>
            <div class="hidden md:flex items-center gap-8" style="font-family: system-ui, sans-serif;">
                <a href="#stories" class="text-sm text-slate-500 hover:text-slate-700 transition-colors">Historias</a>
                <a href="#how" class="text-sm text-slate-500 hover:text-slate-700 transition-colors">Cómo funciona</a>

                <!-- Esto del renderizado condicional lo hago para saber si estoy en /stories, en este caso si eso es correcto no se renderiza el boton de empezar a leer -->
                <NuxtLink v-if="route.path !== '/stories'" to="/stories"
                    class="text-sm px-5 py-2.5 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-all hover:scale-105 shadow-md shadow-slate-200">
                    Empezar a leer ✨
                </NuxtLink>
            </div>
        </nav>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
</style>