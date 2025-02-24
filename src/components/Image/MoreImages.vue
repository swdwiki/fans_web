<template>
  <div class="more-images" :class="[!imgPreview ? 'flex flex-row flex-wrap' : '']">
    <template v-for="(img, index) in images" :key="index">
      <image-tool
        v-if="(!imgPreview && selectIndex === -1) || (imgPreview && selectIndex === index)"
        ref="imageToolRef"
        class="mr-2 mb-2"
        :class="[!imgPreview ? 'w-[180px] h-[180px]' : '']"
        :image="img"
        :author="author"
        :show-prev="images.length === 1 || index === 0 ? false : true"
        :show-next="images.length === 1 || index === images.length - 1 ? false : true"
        :img-preview="imgPreview"
        @show-img-preview-tool="showImgPreviewTool($event, index)"
        @show-img-preview="showImgPreview"
        @change-img-index="changeImgIndex"
      />
    </template>
    <a-image-preview-group
      v-model:visible="imageFullPreviewVisible"
      v-model:current="imageViewSelectIndex"
      infinite
      :src-list="setImagesList(images)"
    />
  </div>
</template>

<script setup lang="ts">
import { Images } from '@/api/modules/default';

const props = defineProps({
  images: {
    type: Array<Images>,
    default: () => {
      return [];
    },
  },
  author: {
    type: String,
    default: '',
  },
});

const imageViewSelectIndex = ref<number>(0);

const setImagesList = (images: Array<any>): Array<string> => {
  const imgList: Array<string> = [];
  images.forEach((image) => {
    imgList.push(image.url);
  });
  return imgList;
};

const imageFullPreviewVisible = ref(false);
const selectIndex = ref<number>(-1);
const imageToolRef = ref<any>();
const imgPreview = ref(false);
const showImgPreviewTool = (type: boolean, index: number) => {
  if (type) {
    selectIndex.value = index;
    imageViewSelectIndex.value = index;
  } else {
    selectIndex.value = -1;
    imageViewSelectIndex.value = 0;
  }
  imgPreview.value = type;
};
const showImgPreview = () => {
  imageFullPreviewVisible.value = true;
};

const changeImgIndex = (page: number) => {
  // selectIndex.value = index;
  if (page === -1 && selectIndex.value !== 0) {
    selectIndex.value -= 1;
  } else if (page === 1 && selectIndex.value < props.images.length - 1) {
    selectIndex.value += 1;
  }
};
</script>

<style lang="scss" scoped></style>
