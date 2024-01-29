<template>
  <div class="index-container">
    <div class="left-container">
      <div class="top mb-5" style="width: 920px">
        <IndexSwiper></IndexSwiper>
      </div>
      <div class="bottom flex flex-row flex-nowrap">
        <post-wrap></post-wrap>
        <!-- <div class="left">
          <div class="post-nav bg-white">
          </div>
        </div>
        <div class="right ml-5">
          <div class="post-list mb-10">
            <post-list
              ref="PostListRef"
              :select-subject="Number(selectSubjectId)"
              :plates="platesList"
              :select-plate-id="selectPlateId"
            />
          </div>
        </div> -->
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
import IndexSwiper from '@/views/home/components/IndexSwiper.vue';

const subjectList = ref<Array<any>>([]);
const platesList = ref<Array<any>>([]);
const selectNav = ref<any>(-1);
const selectPlateId = ref<number>(0);
const PostListRef = ref<any>(null);

const selectSubjectId = ref<number>(-1);

onMounted(async () => {
  subjectList.value = (await postApi.getSubjectList()).data;
  platesList.value = subjectList.value[0].plates;
  selectNav.value = subjectList.value[0].subjectId;
});

// const changeNav = (subjectId: string | number) => {
//   selectNav.value = Number(subjectId);
//   selectSubjectId.value = Number(subjectId);

//   if (subjectId !== -1) {
//     const subjectIndex = subjectList.value.findIndex((subject: any) => {
//       return subject.subjectId === subjectId;
//     });
//     platesList.value = subjectList.value[subjectIndex].plates;
//     PostListRef.value?.resetPlate();
//   } else {
//   }
// };
</script>

<style lang="scss" scoped>
.index-container {
  width: 1200px;
  @apply flex flex-row flex-nowrap items-start justify-between mx-auto;
}

.post-nav {
  width: 150px;
  // position: sticky;
  // top: 80px;
  height: fit-content;
  border-radius: 4px;
}

.post-list {
  width: 750px;
}
</style>
