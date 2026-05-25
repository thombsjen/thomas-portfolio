<script setup>
import HeroSection from './components/HeroSection.vue'
import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <div class="app-root">
    <CustomCursor />
    <HeroSection />
  </div>
</template>

<style scoped>
.app-root {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
}
</style>
