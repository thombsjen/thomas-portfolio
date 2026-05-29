<script setup>
import CustomCursor from './components/CustomCursor.vue'
import SlideMenu from './components/SlideMenu.vue'
</script>

<template>
  <div class="app-root">
    <CustomCursor />
    <SlideMenu />
    <RouterView />
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
