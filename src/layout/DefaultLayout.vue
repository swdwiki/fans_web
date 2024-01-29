<template>
  <div class="container max-w-full">
    <top-header class="fixed top-0 w-full z-[100]" />
    <div class="view-container mt-[80px]">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.view-container {
  width: 100%;
}
</style>
