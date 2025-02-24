<template>
  <NormalToolbar title="movie" @click="onChange">
    <template #trigger>
      <div class="flex flex-col items-center">
        <icon-play-circle-fill :size="10" class="text-center" style="margin-top: 2px" />
        <span class="text-xs">视频</span>
      </div>
    </template>
  </NormalToolbar>
  <a-modal :visible="mVisible" width="50%" ok-text="添加视频" @ok="addMovIframe" @cancel="mVisible = false">
    <template #title>
      <span>添加B站视频</span>
    </template>
    <span class="text-center text-gray-500 w-full leading-[40px]">当前只支持添加B站视频</span>
    <div class="flex flex-col justify-start items-start">
      <span class="leading-[30px] mb-[5px] font-bold">要添加的B站视频链接</span>
      <div class="flex flex-row justify-start items-center w-full">
        <a-input v-model="inputBiliUrl" placeholder="请输入B站视频链接" class="w-[200px]"></a-input>
        <a-button class="my-[10px]" type="primary" @click="preview">视频预览</a-button>
      </div>
      <template v-if="showPreview">
        <div class="w-full h-[400px]">
          <iframe
            :src="previewUrl"
            width="100%"
            height="400px"
            frameborder="0"
            allowfullscreen
            style="margin-top: 10px"
          ></iframe>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NormalToolbar } from 'md-editor-v3';
import { Message } from '@arco-design/web-vue';
import type { PropType } from 'vue';
import type { InsertContentGenerator } from 'md-editor-v3';

const props = defineProps({
  onInsert: {
    type: Function as PropType<(generator: InsertContentGenerator) => void>,
    default: () => () => null,
  },
});

const mVisible = ref(false);
const showPreview = ref(false);
const previewUrl = ref('');

const onChange = () => {
  mVisible.value = !mVisible.value;
};

const inputBiliUrl = ref('');

const preview = () => {
  if (!inputBiliUrl.value) {
    Message.warning('请输入B站视频链接');
  } else if (!inputBiliUrl.value.includes('bilibili.com')) {
    Message.warning('请输入正确的B站视频链接');
  } else {
    const arr = new URL(inputBiliUrl.value).pathname.split('/');
    previewUrl.value = `//player.bilibili.com/player.html?bvid=${arr[2]}&autoplay=0`;
    showPreview.value = true;
  }
};

const addMovIframe = () => {
  if (!inputBiliUrl.value) {
    Message.warning('请输入B站视频链接');
  } else if (!inputBiliUrl.value.includes('.bilibili.com')) {
    Message.warning('请输入正确的B站视频链接');
  } else {
    const arr = new URL(inputBiliUrl.value).pathname.split('/');
    const url = `<iframe src="//player.bilibili.com/player.html?bvid=${arr[2]}&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="800" height="400" style="width: 100%; height: 500px; max-width: 100%；align:center; padding:20px 0;"> </iframe>`;
    const res = {
      targetValue: `${url}`,
      select: url,
      deviationStart: 0,
      deviationEnd: url.length,
    };

    const generator: InsertContentGenerator = () => {
      return {
        targetValue: `${url}`,
        select: false,
        deviationEnd: url.length - 1,
      };
    };

    props.onInsert(generator);

    mVisible.value = false;
    showPreview.value = false;
  }
};
</script>

<script lang="ts">
export default {
  name: 'MovExtension',
};
</script>
