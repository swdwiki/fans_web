<template>
  <div v-if="!imgPreview" class="h-full" @click="showImgPreviewTool(true)">
    <img
      :style="{
        width: Number.isNaN(Number(imgSize)) ? imgSize : imgSize + 'px',
        height: Number.isNaN(Number(imgSize)) ? imgSize : imgSize + 'px',
      }"
      :src="`${image.url}?w=200&h=200`"
      class="object-cover"
    />
  </div>
  <div v-else-if="imgPreview" class="w-full">
    <div class="action-bar flex flex-row flex-nowrap bg-gray-100 p-3">
      <div class="flex flex-row justify-start items-center mr-3 cursor-pointer" @click="showImgPreviewTool(false)">
        <icon-zoom-out size="15" />
        <span class="ml-1 text-xs">收起</span>
      </div>
      <div class="flex flex-row justify-start items-center mr-3 cursor-pointer" @click="showImgPreview">
        <icon-zoom-in size="15" />
        <span class="ml-1 text-xs">查看大图</span>
      </div>
      <!-- <div v-if="showRotateHandle" class="flex flex-row justify-start items-center mr-3" @click="rotateImage(-90)">
        <icon-rotate-left size="15" />
        <span class="ml-1 text-xs">向左旋转</span>
      </div>
      <div v-if="showRotateHandle" class="flex flex-row justify-start items-center mr-3" @click="rotateImage(90)">
        <icon-rotate-right size="15" />
        <span class="ml-1 text-xs">向右旋转</span>
      </div> -->
    </div>
    <div ref="imgBoxRef" class="w-full h-full transform-gpu relative">
      <img ref="imgRef" :src="image.url" draggable="false" class="w-full" />
      <!--  -->
      <!-- <div></div> -->
      <div v-if="showPrev" class="toggle-area prev" @click="prevImage(-1)"></div>
      <div class="toggle-area-zoomout zoomout" @click="showImgPreviewTool(false)"></div>
      <div v-if="showNext" class="toggle-area next" @click="prevImage(1)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  image: {
    type: Object,
    default: () => {
      return {};
    },
  },
  author: {
    type: String,
    default: '',
  },
  imgSize: {
    type: Number || String,
    default: 180,
  },
  showNext: {
    type: Boolean,
    default: false,
  },
  showPrev: {
    type: Boolean,
    default: false,
  },
  imgPreview: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (event: 'showImgPreviewTool', value: boolean): void;
  (event: 'showImgPreview'): void;
  (event: 'changeImgIndex', index: number): void;
}>();
// const imgPreview = ref(false);
const imgRef = ref<any>();
const imgBoxRef = ref<any>();
const showRotateHandle = ref(true);

const prevImage = (index: number) => {
  emit('changeImgIndex', index);
};

const rotateAngle = ref(0);

const showImgPreviewTool = (type: boolean) => {
  // imgPreview.value = type;
  if (!type) {
    rotateAngle.value = 0;
  }
  emit('showImgPreviewTool', type);
  nextTick();
};

const showImgPreview = () => {
  emit('showImgPreview');
};

const rotateImage = (rotateNum: number) => {
  if (rotateAngle.value + rotateNum >= 360) {
    rotateAngle.value = 0;
  } else if (rotateAngle.value + rotateNum <= -360) {
    rotateAngle.value = 0;
  } else {
    rotateAngle.value += rotateNum;
  }
  const width = imgRef.value.clientWidth;
  const height = imgRef.value.clientHeight;
  imgBoxRef.value.style.width = `${width}px`;
  imgBoxRef.value.style.height = `${(width * width) / height}px`;
  if (Math.abs(rotateAngle.value) === 90 || Math.abs(rotateAngle.value) === 270) {
    if (width >= height) {
      imgBoxRef.value.style.width = `${width}px`;
      imgBoxRef.value.style.height = `${(width * width) / height}px`;
      imgRef.value.style.height = `${(width * width) / height}px`;
      imgRef.value.style.transform = `rotate(${rotateAngle.value}deg) scale(${width / height})`;
    } else {
      // 修改
      imgBoxRef.value.style.width = `${width}px`;
      imgBoxRef.value.style.height = `${(width * width) / height}px`;
      // imgRef.value.style.height = `${width}px`;
      imgRef.value.style.width = `${width}px`;
      // 修改结束
      imgRef.value.style.transform = `rotate(${rotateAngle.value}deg) scale(${width / height}) translate(0,0)`;
    }
  }
  if (Math.abs(rotateAngle.value) === 180 || Math.abs(rotateAngle.value) === 0) {
    if (width >= height) {
      imgBoxRef.value.style.width = `${width}px`;
      imgBoxRef.value.style.height = `${(width * width) / height}px`;
      imgRef.value.style.height = `${(width * width) / height}px`;
      imgRef.value.style.transform = `rotate(${rotateAngle.value}deg) scale(1)`;
    } else {
      imgBoxRef.value.style.width = `${width}px`;
      imgBoxRef.value.style.height = `${(width * height) / width}px`;
      imgRef.value.style.width = `${width}px`;
      imgRef.value.style.transform = `rotate(${rotateAngle.value}deg) scale(1)`;
    }
  }
};
// defineExpose([imgPreview]);
</script>

<style lang="scss" scoped>
.prev {
  left: 0;
  cursor: url(data:;base64,AAABAAEAEBwAAAEAIACYBwAAFgAAACgAAAAQAAAAOAAAAAEAIAAAAAAAAAcAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAK9fX1gfn5+YUAAAAGAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1g///////////+fn5ggAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hP////////////////39/YIAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hf////////////////v7+4IAAAADAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2h/////////////////v7+4AAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iP////////////////v7+38AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2if////////////////v7+34AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2i/////////////////v7+3wAAAADAAAAAgAAAAEAAAABAAAAAQAAAAMAAAAFAAAABwAAAAkAAAAL9vb2jP////////////////v7+3sAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAFAAAABwAAAAkAAAAL9vb2jf////////////////v7+3oAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAABgAAAAkAAAAL9vb2j/////////////////v7+3gAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAcAAAAK9vb2kP////////////////n5+XgAAAAEAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAH+Pj4kP////////////////T09HkAAAAHAAAABAAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAA+/v7j/////////////////Ly8nkAAAAKAAAACAAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAPv7+3T////////////////29vaKAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAD+/v7d/////////////////b29ogAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAgAAAAP7+/t6////////////////9fX1hQAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAEAAAACAAAAA/v7+33////////////////19fWCAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAQAAAAIAAAAD+/v7gP////////////////X19X8AAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAABAAAAAgAAAAP7+/uD////////////////9fX1fAAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+4b////////////////09PR5AAAACwAAAAkAAAAHAAAABQAAAAMAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7if////////////////Ly8ncAAAAKAAAACQAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP7+/uM////////////////8vLydQAAAAoAAAAIAAAABQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+47////////////////09PRxAAAACAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7kf////////////////b29m0AAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP9/f2T///////////////++vr6aQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/39/Zb//////////v39/WkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAGAgIAC////lv39/WgAAAAC8AAAAOAAAADAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAAAHAAAADwAAAA8AAAAHAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAAAOAAAADwAAAA+AAAAPwAAAD+AAAA/wAAAA==),
    auto;
}
.next {
  right: 0;
  cursor: url(data:;base64,AAABAAEAEBwAAAEAIACYBwAAFgAAACgAAAAQAAAAOAAAAAEAIAAAAAAAAAcAABILAAASCwAAAAAAAAAAAAAAAAAG+fn5hfX19YEAAAAKAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAA+fn5gv//////////9fX1gwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAP39/YL////////////////19fWEAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAAAAAAAAAAAD+/v7gv////////////////X19YUAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAAAAAAAAgAAAAP7+/uA////////////////9vb2hwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAEAAAABAAAAAQAAAAEAAAACAAAAA/v7+3/////////////////29vaIAAAACwAAAAkAAAAHAAAABQAAAAMAAAACAAAAAQAAAAEAAAABAAAAAQAAAAIAAAAD+/v7fv////////////////b29okAAAALAAAACQAAAAcAAAAFAAAAAwAAAAIAAAABAAAAAQAAAAEAAAABAAAAAgAAAAP7+/t8////////////////9vb2iwAAAAsAAAAJAAAABwAAAAUAAAADAAAAAgAAAAAAAAABAAAAAQAAAAEAAAACAAAAA/v7+3v////////////////29vaMAAAACwAAAAkAAAAHAAAABQAAAAMAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAIAAAAD+/v7ev////////////////b29o0AAAALAAAACQAAAAcAAAAFAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAP7+/t4////////////////9vb2jwAAAAsAAAAJAAAABgAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAACAAAABPn5+Xj////////////////29vaQAAAACgAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAQAAAAH9PT0ef////////////////j4+JAAAAAHAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAACAAAAAry8vJ5////////////////+/v7jwAAAAAAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iv////////////////v7+3QAAAAAAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9vb2iP////////////////v7+3cAAAADAAAAAQAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1hf////////////////v7+3oAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1gv////////////////v7+30AAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1f/////////////////v7+4AAAAADAAAAAgAAAAEAAAABAAAAAgAAAAMAAAAFAAAABwAAAAkAAAAL9fX1fP////////////////v7+4MAAAADAAAAAgAAAAEAAAABAAAAAQAAAAMAAAAFAAAABwAAAAkAAAAL9PT0ef////////////////v7+4YAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAEAAAABgAAAAkAAAAK8vLyd/////////////////v7+4kAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAABQAAAAgAAAAK8vLydf////////////////v7+4sAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAYAAAAI9PT0cf////////////////v7+44AAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAF9vb2bf////////////////v7+5EAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAA+vr6af////7///////////39/ZMAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP39/Wr////+//////39/ZYAAAADAAAAAgAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC/f39aP///5aAgIACAAAAAQAAAAEAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAHAAAAAwAAAAEAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAAAOAAAADwAAAA8AAAAOAAAADAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAMAAAAHAAAADwAAAB8AAAA/AAAAfwAAAP8AAA==),
    auto;
}

.zoomout {
  width: 100%;
  cursor: zoom-out;
  z-index: 0;
}

.toggle-area {
  @apply absolute top-0 w-[30%] h-full;
  z-index: 1;
}
.toggle-area-zoomout {
  position: absolute;
  top: 0;
  height: 100%;
}
</style>
