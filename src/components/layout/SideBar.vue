<template>
  <div>
    <div class="sign-card py-4 flex flex-row justify-center items-center mb-5">
      <div class="mr-5 flex flex-col justify-start">
        <span class="text-base font-bold">{{ formatTime() }}</span>
        <!-- <span class="text-xs text-slate-500">连续签到1天</span> -->
        <span class="text-xs text-slate-500">{{ new Date().getMonth() + 1 }}月{{ new Date().getDate() }}日</span>
      </div>
      <a-button
        v-if="!userInfo.todaySign"
        class="ml-5"
        type="primary"
        size="large"
        @click="router.push({ name: 'UserSignin' })"
        >去签到</a-button
      >
      <a-button v-else type="outline" class="ml-5" size="large" @click="router.push({ name: 'UserSignin' })"
        >今日已签到</a-button
      >
    </div>
    <div class="ad-list mb-5">
      <!-- <template v-if="adList && adList.length !== 0"> -->
      <div v-for="(ad, index) in adList" :key="index" class="ad-item mb-5 relative">
        <a :href="ad.url" target="_blank" class="relative">
          <a-tag class="absolute top-2 left-2" color="arcoblue">推广</a-tag>
          <img :src="ad.imgUrl" alt="" class="object-cover" />
        </a>
      </div>
      <!-- </template> -->
    </div>
    <div class="web-list bg-white mb-5">
      <ul class="url-list w-full flex flex-col justify-start py-3">
        <li v-for="(url, index) in indexUrlList" :key="index" class="pl-3 url block hover:bg-gray-200">
          <a
            v-if="!url.showImg"
            :href="url.url"
            target="_blank"
            class="flex flex-row flex-nowrap justify-start items-center py-3"
          >
            <div v-if="url.icon">
              <icon-font :type="url.icon" :size="30" />
            </div>
            <div v-else>
              <img class="url-cover" :src="url.cover" :alt="url.name" />
            </div>
            <span class="ml-3 text-sm">{{ url.name }}</span>
          </a>
          <a-popover v-else>
            <div class="flex flex-row flex-nowrap justify-start items-center py-3">
              <div v-if="url.icon">
                <icon-font :type="url.icon" :size="30" />
              </div>
              <div v-else>
                <img class="url-cover" :src="url.cover" :alt="url.name" />
              </div>
              <span class="ml-3 text-sm">{{ url.name }}</span>
            </div>
            <template #content>
              <img :src="url.imgUrl" class="w-30 h-30 object-cover" />
            </template>
          </a-popover>
        </li>
      </ul>
    </div>
    <div class="web-info">
      <div class="link-list my-2 leading-8 flex flex-row justify-between items-center">
        <!-- 友情链接 -->
        <!-- <router-link class="link" :to="{ name: 'system' }">平台制度</router-link> -->
        <!-- 关于我们 -->
        <!-- <router-link class="link" :to="{ name: 'about' }">关于网站</router-link> -->
        <!-- 网站制度 -->
        <!-- <router-link class="link" :to="{ name: 'links' }">友情链接</router-link> -->
        <!-- 意见反馈 -->
        <!-- <router-link class="link" :to="{ name: 'feedback' }">意见反馈</router-link> -->
      </div>
      <div class="info">
        <span>联系邮箱： swdwiki@163.com</span>
        <span>联系微信： xmsn90</span>
        <span>黑ICP备19007667号-3</span>
        <span>©1990-{{ new Date().getFullYear() }} 轩辕剑 All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { Icon } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import config from '@/config/config';
import { useUserStore } from '@/store';
import { getAssetsFile } from '@/utils/format';

const router = useRouter();

const { userInfo } = useUserStore();

const injectHandle: any = inject('authModal');

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });

const adList = ref<Array<any>>([
  {
    name: '《轩辕剑外传：枫之舞》重置版上线',
    url: 'https://store.steampowered.com/app/1638230/_/?curator_clanid=4777282',
    imgUrl: 'https://s1.ax1x.com/2023/07/31/pP9Z9QP.jpg',
  },
  // {
  //   name: '轩辕剑三上线STEAM',
  //   url: 'https://store.steampowered.com/app/1638230/_/?curator_clanid=4777282',
  //   imgUrl: 'https://s1.ax1x.com/2023/07/31/pP9Z9QP.jpg',
  // },
  // {
  //   name: '胡玩文化——拓跋玉儿可动兵人手办潮玩',
  //   url: 'https://weibo.com/7765795702/Ma8zv6pnl?pagetype=profilefeed',
  //   imgUrl: 'https://s1.ax1x.com/2023/08/07/pPEkmhF.jpg',
  // },
]);

const indexUrlList = ref<Array<any>>([
  {
    name: '轩辕剑官方微博',
    icon: '',
    cover: getAssetsFile('swdmain.jpeg', 'img'),
    showImg: false,
    url: 'https://weibo.com/u/2591414652',
  },
  {
    name: '轩辕剑官方微信公众号',
    icon: '',
    cover: getAssetsFile('wxicon.png', 'img'),
    showImg: true,
    url: 'https://store.steampowered.com/app/1638230/_/?curator_clanid=4777282',
    imgUrl: getAssetsFile('qrcode.bmp', 'img'),
  },
]);

const formatTime = () => {
  const date = new Date();
  const hour = date.getHours();

  if (hour <= 12 && hour > 6) {
    return '早上好!';
  }
  if (hour >= 0 && hour <= 6) {
    return '深夜好!';
  }
  if (hour > 12 && hour <= 18) {
    return '下午好';
  }
  return '晚上好';
};

const sign = () => {
  if (!localStorage.getItem('swdwikiAccessToken')) {
    injectHandle.openAuthModal('login');
  } else {
    router.push({
      name: 'UserSignIn',
    });
  }
};
</script>

<style lang="scss" scoped>
.side-bar {
  width: 260px;

  .sign-card {
    background: #fff;
    border-radius: 5px;
  }
}

.ad-list {
  .ad-item {
    width: 260px;
    height: 120px;

    img {
      height: 120px;
      width: 100%;
      object-fit: cover;
      border-radius: 5px;
    }
  }
}
.web-list {
  .url-list {
    .url {
      .url-cover {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }

      &:hover {
        background: #eee;
      }
    }
  }
}

.web-info {
  .link-list {
    @apply text-gray-500 text-xs leading-6 w-full;
    .link {
      @apply text-gray-500 hover:text-sky-600 transition-all ease-out duration-100 text-xs leading-6;
    }
  }
  .info {
    display: flex;
    flex-flow: column;
    justify-content: center;
    span {
      @apply text-gray-500 text-xs leading-6;
    }
  }
}
</style>
