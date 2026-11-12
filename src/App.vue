<script setup>
import NavBar from './components/NavBar.vue'
import FloatingHearts from './components/FloatingHearts.vue'
</script>

<template>
  <FloatingHearts />
  <NavBar />
  <main class="main">
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>
