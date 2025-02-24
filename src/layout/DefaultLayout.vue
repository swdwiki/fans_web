<template>
  <div class="container max-w-full">
    <top-header ref="topHeader" class="fixed top-0 w-full z-[999]" />
    <div class="view-container">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopHeader from '@/components/layout/TopHeader.vue';

const topHeader = ref(null);

provide('topHeader', {
  getCommentCount: (type: any) => {
    topHeader.value?.getCommentCount();
  },
  returnCommentCount: (count: any) => {
    return topHeader.value?.messageCounts;
  },
});

onMounted(() => {
  topHeader.value?.getCommentCount();
});
</script>

<style lang="scss" scoped>
.view-container {
  width: 100%;
}
</style>
