<template>
  <div class="index-container">
    <div class="left-container">
      <!-- <div class="top mb-5" style="width: 920px">
        <HomeSwiper />
      </div> -->
      <div class="bottom flex flex-row flex-nowrap">
        <PostWrap />
      </div>
    </div>
    <div class="right-container">
      <div class="side-bar">
        <side-bar></side-bar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import postApi from '@/api/modules/post';

const subjectList = ref<Array<any>>([]);
const platesList = ref<Array<any>>([]);
const selectNav = ref<any>(-1);

onMounted(async () => {
  subjectList.value = (await postApi.getSubjectList()).data;
  platesList.value = subjectList.value[0].plates;
  selectNav.value = subjectList.value[0].subjectId;
});
</script>

<style lang="scss" scoped>
.index-container {
  width: 1200px;
  @apply flex flex-row flex-nowrap items-start justify-between mx-auto mt-[80px];
}

.post-nav {
  width: 150px;
  height: fit-content;
  border-radius: 4px;
}

.post-list {
  width: 750px;
}
</style>
