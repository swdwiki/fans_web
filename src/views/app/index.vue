<template>
  <div class="down-container">
    <div class="left">
      <!-- <div class="cover">
        <img
          class="cover-img"
          src="https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/img/app.72d1b78.png"
          alt=""
        />
      </div> -->
    </div>
    <div class="right">
      <div class="main">
        <img class="app-logo" :src="getAssetsFile('down_logo.png', 'img')" />
        <span class="app-main-content">轩辕剑创作讨论社区</span>
      </div>
      <div class="btns">
        <div v-for="(btn, index) in btnList" :key="index" class="download-btn">
          <div class="flex flex-row justify-center items-center">
            <img class="btn-icon" :src="getAssetsFile(btn.icon, 'svg')" :alt="btn.name + '下载'" />
            <span class="down-platform-text">{{ btn.name }}</span>
          </div>
          <span v-if="!btn.show" class="down-mark">{{ btn.content || '敬请期待' }}</span>
        </div>
      </div>
      <!-- <div class="down-infos">
        <div class="info-wrap">
          <span class="">更新日志</span>
          <icon-right />
        </div>

        <div class="info-wrap">
          <span class="">更新&修复计划</span>
          <icon-right />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssetsFile } from '@/utils/format';

const btnList = [
  {
    name: 'Android',
    icon: 'Android.svg',
    showQrcode: false,
    show: false,
    url: '',
    content: '2月下旬开放下载',
  },
  {
    name: 'App Store',
    icon: 'Apple.svg',
    showQrcode: false,
    show: false,
    url: '',
    content: '3月中旬上架商店',
  },
  {
    name: 'HarmonyOS',
    icon: 'HarmonyOS.svg',
    showQrcode: false,
    show: false,
    url: '',
    content: '敬请期待',
  },
];
</script>

<style lang="scss" scoped>
.down-container {
  @apply bg-gray-50 w-full flex flex-row flex-nowrap justify-center items-center mt-[60px];
  height: calc(100vh - 60px);

  .left {
    margin-right: 20px;
    .cover {
      @apply w-[420px] mt-[30px] ml-[100px];
      //   filter: drop-shadow(40px 40px 100px rgba(0, 0, 0, 0.15));
      .cover-img {
        @apply w-full;
      }
    }
  }
  .right {
    // @apply w-[420px];
    margin-left: 20px;

    .main {
      @apply flex flex-col items-center;
      .app-main-content {
        @apply text-3xl font-bold;
      }

      .app-logo {
        @apply w-[400px] mb-[20px] object-cover;
      }
    }

    .btns {
      @apply flex flex-row flex-nowrap justify-center items-center mt-[80px];

      .download-btn {
        @apply w-[180px] h-[50px] rounded-sm bg-white text-center mx-[10px] hover:bg-gray-100 flex flex-col justify-center items-center;

        .down-platform-text {
          @apply text-base  font-bold text-black;
        }

        .btn-icon {
          @apply w-[20px] h-[20px] mr-[5px];
        }
      }

      .down-mark {
        @apply text-xs text-center text-gray-400;
      }
    }

    .down-infos {
      @apply mt-[30px] flex flex-row justify-center items-center;
      .info-wrap {
        @apply text-sm text-center text-gray-400 mx-[20px];
      }
    }
  }
}

.btn-bg {
  @apply w-full h-full object-cover;
}
</style>
