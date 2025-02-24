<template>
  <div class="auth-btn">
    <a-button-group>
      <a-button @click="injectHandle.openAuthModal('login')">登录</a-button>
      <a-button @click="injectHandle.openAuthModal('reg')">注册</a-button>
    </a-button-group>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const injectHandle: any = inject('authModal');
</script>

<style lang="scss" scoped>
.auth-btn {
}

:deep(.arco-input-append) {
  padding: 0;
}
</style>
