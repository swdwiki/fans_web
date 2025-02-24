<template>
  <div ref="topheaderRef" class="top-header flex flex-row justify-between items-center">
    <a-modal v-model:visible="logoutModal" @ok="logoutAccount">
      <template #title>退出账号</template>
      <span class="text-center w-full block text-base font-bold my-[20px]">是否确定退出当前账号？</span></a-modal
    >
    <div class="left flex flex-row justify-between items-center">
      <div class="logo nav-item">
        <router-link :to="{ name: 'home' }" class="logo flex flex-row flex-nowrap justify-start items-center w-full">
          <img :src="getAssetsFile('logo.svg', 'svg')" alt="轩辕天书" class="logo-img w-8 block mr-2" />
          <span class="logo-text block">轩辕天书</span>
        </router-link>
      </div>
      <div class="nav-list mx-5 h-full block">
        <ul class="flex flex-row items-center">
          <li v-for="(nav, index) in navlist" :key="index" class="px-4 h-full block">
            <template v-if="!nav.out">
              <router-link :to="{ name: nav.module }" class="text-black h-full block">{{ nav.name }}</router-link>
            </template>
            <template v-else>
              <a v-if="!nav.icon" class="text-black" :href="nav.url" target="_blank">{{ nav.name }}</a>
              <a v-else class="text-black" :href="nav.url" target="_blank">
                <img :src="nav.icon" alt="icon" class="h-[42px]" />
              </a>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="right flex flex-row justify-between items-center">
      <div class="nav-item search">
        <search-box />
      </div>
      <div
        v-if="isLoginStatus"
        class="message-box text-gray-600 mx-[20px] relative"
        @click="router.push({ name: 'MessageManager' })"
      >
        <a-trigger
          trigger="hover"
          :show-arrow="true"
          blur-to-close
          auto-fix-position
          :scroll-to-close="false"
          :click-outside-to-close="true"
          position="bottom"
          :popup-offset="10"
          :popup-container="topheaderRef"
        >
          <div class="relative">
            <div
              v-if="messageCounts.count > 0"
              class="count-baege absolute top-[-10px] right-[-10px] rounded-full bg-red-500 text-white text-[10px] py-[2px] px-[5px]"
            >
              {{ messageCounts.count > 99 ? '99+' : messageCounts.count }}
            </div>
            <svg
              t="1737632272353"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5332"
              width="24"
              height="24"
            >
              <path
                d="M793.389 806.69h120.208a37.087 37.087 0 0 0 0-74.218h-53.159V445.217a356.307 356.307 0 0 0-267.843-345.132 89.043 89.043 0 1 0-176.75 0 356.307 356.307 0 0 0-267.71 345.132v287.255H103.88a37.087 37.087 0 1 0 0 74.217h149.771v-0.133H793.39v0.133z m-422.69 83.745a134.945 134.945 0 0 0 267.13 0H370.7z"
                p-id="5333"
                fill="#8a8a8a"
              ></path>
            </svg>
          </div>
          <template #content>
            <div class="message-box-trigger">
              <div
                class="w-full flex flex-row justify-between items-center px-[10px] h-[50px] hover:bg-gray-100"
                @click="router.push({ name: 'CommentMessage', query: { type: 'post' } })"
              >
                <span>评论</span>
                <a-badge :max-count="99" :count="messageCounts.comment" />
              </div>
              <div
                class="w-full flex flex-row justify-between items-center px-[10px] h-[50px] hover:bg-gray-100"
                @click="router.push({ name: 'ReplyMessage', query: { type: 'post' } })"
              >
                <span>回复</span>
                <a-badge :max-count="99" :count="messageCounts.reply" />
              </div>
              <div
                class="w-full flex flex-row justify-between items-center px-[10px] h-[50px] hover:bg-gray-100"
                @click="router.push({ name: 'LikeMessage', query: { type: 'post' } })"
              >
                <span>赞</span>
                <a-badge :max-count="99" :count="messageCounts.like" />
              </div>
              <div
                class="w-full flex flex-row justify-between items-center px-[10px] h-[50px] hover:bg-gray-100"
                @click="router.push({ name: 'FanMessage' })"
              >
                <span>新增粉丝</span>
                <a-badge :max-count="99" :count="messageCounts.fan" />
              </div>
              <div
                class="w-full flex flex-row justify-between items-center px-[10px] h-[50px] hover:bg-gray-100"
                @click="router.push({ name: 'SystemMessage' })"
              >
                <span>系统通知</span>
                <a-badge :max-count="99" :count="messageCounts.system" />
              </div>
            </div>
          </template>
        </a-trigger>
      </div>
      <div v-if="isLoginStatus" class="nav-item creater mx-2">
        <creator-btn />
      </div>
      <div id="navuser" class="nav-item menu mx-2">
        <div v-if="!isLoginStatus" class="no_login">
          <auth-btn></auth-btn>
        </div>
        <div v-else>
          <a-trigger
            trigger="click"
            :popup-translate="[-120, 0]"
            :show-arrow="false"
            blur-to-close
            auto-fix-position
            :update-at-scroll="true"
            :scroll-to-close="false"
            :click-outside-to-close="true"
            :render-to-body="false"
            :popup-container="topheaderRef"
          >
            <a-avatar :size="40">
              <img class="object-cover w-50 h-50" alt="avatar" :src="userInfo.avatar" />
            </a-avatar>
            <template #content>
              <div class="bg-white w-[280px] border border-gray-200">
                <div class="userinfo mx-auto w-[90%]">
                  <div class="flex flex-row justify-start items-center my-[20px]">
                    <a-avatar :size="50">
                      <img class="object-cover w-50 h-50" alt="avatar" :src="userInfo.avatar" />
                    </a-avatar>
                    <div class="flex flex-col justify-between items-start ml-[10px]">
                      <span class="block text-[18px] font-semibold h-[25px] leading-[25px]">{{
                        userInfo.nickname
                      }}</span>
                      <router-link :to="{ name: 'FireDetail' }" class="text-xs h-[25px] leading-[25px]"
                        >黑火能量：{{ userInfo.fire }}
                        <icon-right :size="14" />
                      </router-link>
                    </div>
                  </div>
                  <div class="level-exp-box bg-blue-50 rounded-md mx-auto h-[45px] py-[5px] px-[10px]">
                    <div class="top text-xs flex flex-row justify-between text-blue-500 font-semibold mt-[3px]">
                      <span class="level"
                        >等级 LV.{{ userInfo.level?.level }}
                        <span class="level-content">{{ userInfo.level?.content }}</span></span
                      >
                      <router-link :to="{ name: 'UserLevel' }" class="exp"
                        >{{ userInfo.exp }}/{{ userInfo.level?.maxExp }} <icon-right :size="14"
                      /></router-link>
                    </div>
                    <div class="bottom mx-auto">
                      <a-progress
                        :percent="userInfo.exp && userInfo.level ? userInfo.exp / userInfo.level?.maxExp : 0"
                        :style="{ width: '100%' }"
                        track-color="#1e80ff33"
                        :show-text="false"
                      >
                      </a-progress>
                    </div>
                  </div>
                  <div class="creator-count mx-auto">
                    <div class="flex flex-row flex-wrap justify-around">
                      <router-link
                        :to="{ name: 'UserHome', params: { id: userInfo.userId }, query: { type: 'follow' } }"
                        class="flex flex-col justify-center items-center w-1/3 my-[15px]"
                      >
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.follow }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">关注</span>
                      </router-link>
                      <router-link
                        :to="{ name: 'UserHome', params: { id: userInfo.userId }, query: { type: 'fan' } }"
                        class="flex flex-col justify-center items-center w-1/3 my-[15px]"
                      >
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.fan }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">粉丝</span>
                      </router-link>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.like }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">点赞</span>
                      </div>
                      <router-link
                        :to="{ name: 'SticksCreator' }"
                        class="flex flex-col justify-center items-center w-1/3 my-[15px]"
                      >
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.stick }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">尺牍</span>
                      </router-link>
                      <router-link
                        :to="{ name: 'PostsCreator' }"
                        class="flex flex-col justify-center items-center w-1/3 my-[15px]"
                      >
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.post }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">帖子</span>
                      </router-link>
                      <router-link
                        :to="{ name: 'WorkCreator' }"
                        class="flex flex-col justify-center items-center w-1/3 my-[15px]"
                      >
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.work }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">同人作品</span>
                      </router-link>
                    </div>
                    <a-divider :margin="5" />
                  </div>
                  <div class="actions w-[90%] mx-auto flex flex-row flex-wrap justify-between items-center my-[10px]">
                    <router-link
                      :to="{ name: 'UserHome', params: { id: userInfo.userId } }"
                      class="w-1/2 flex flex-row justify-center items-center h-[40px] leading-[40px] group hover:bg-gray-100 cursor-pointer"
                    >
                      <div class="text-gray-500 group-hover:text-blue-500 font-semibold">
                        <icon-user :size="15" />
                      </div>
                      <span class="text-[15px] ml-[5px] group-hover:text-blue-500 font-semibold">个人主页</span>
                    </router-link>
                    <router-link
                      :to="{ name: 'UserCenter' }"
                      class="w-1/2 flex flex-row justify-center items-center h-[40px] leading-[40px] hover:bg-gray-100 group cursor-pointer"
                    >
                      <div class="text-gray-500 group-hover:text-blue-500 font-semibold">
                        <icon-computer :size="15" />
                      </div>
                      <span class="text-[15px] ml-[5px] group-hover:text-blue-500 font-semibold">成长中心</span>
                    </router-link>
                    <router-link
                      :to="{ name: 'CreatorCenter' }"
                      class="w-1/2 flex flex-row justify-center items-center h-[40px] leading-[40px] hover:bg-gray-100 group cursor-pointer"
                    >
                      <div class="text-gray-500 group-hover:text-blue-500 font-semibold">
                        <icon-book :size="15" />
                      </div>
                      <span class="text-[15px] ml-[5px] group-hover:text-blue-500 font-semibold">创作管理</span>
                    </router-link>
                    <router-link
                      :to="{ name: 'UserSetting' }"
                      class="w-1/2 flex flex-row justify-center items-center h-[40px] leading-[40px] group hover:bg-gray-100 cursor-pointer"
                    >
                      <div class="text-gray-500 group-hover:text-blue-500 font-semibold">
                        <icon-settings :size="15" />
                      </div>
                      <span class="text-[15px] ml-[5px] group-hover:text-blue-500 font-semibold">我的设置</span>
                    </router-link>
                  </div>
                  <a-divider margin="0" />
                  <div
                    class="text-xs text-gray-500 text-right h-[40px] leading-[40px] px-[10px] flex flex-row justify-end items-center"
                  >
                    <span class="cursor-pointer block text-center w-[60px] cursor-pointer" @click="logoutModal = true"
                      >退出登录</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </a-trigger>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store';
import useUser from '@/hooks/user';
import { getAssetsFile } from '@/utils/format';
import defaultApi from '@/api/modules/default';
import router from '@/router';

const logoutModal = ref(false);
const userStore = useUserStore();

const topheaderRef = ref<HTMLElement>();

const route = useRoute();
const messageCounts = ref({
  count: 0,
  like: 0,
  fan: 0,
  comment: 0,
  system: 0,
  reply: 0,
});
const navlist: Ref<Array<any>> = ref<Array<any>>([
  {
    name: '首页',
    module: 'home',
    query: '',
    out: false,
    url: '',
    login: false,
  },
  {
    name: '尺牍',
    module: 'stick',
    query: '',
    out: false,
    url: '',
    login: false,
  },
  {
    name: '同人工坊',
    module: 'work',
    query: '',
    out: false,
    url: '',
    login: false,
  },
  // {
  //   name: '活动',
  //   module: 'activity',
  //   query: '',
  //   out: false,
  //   url: '',
  //   login: false,
  // },
  {
    name: 'App下载',
    module: 'app',
    query: '',
    out: false,
    url: '',
    login: false,
  },
  {
    name: '枫舞轩辕',
    query: '',
    out: true,
    url: 'http://fwxy.swdwiki.com/',
    login: false,
  },
  {
    name: '枫之舞重置版',
    icon: getAssetsFile('fzw.png', 'img'),
    out: true,
    url: 'http://fzw.swdwiki.com/',
    login: false,
  },
  // {
  //   name: '同人游戏',
  //   module: 'game',
  //   query: '',
  //   out: false,
  //   url: '',
  //   login: false,
  // },
  // {
  //   name: '轩辕导航',
  //   module: 'link',
  //   query: '',
  //   out: false,
  //   url: '',
  //   login: false,
  // },
  // {
  //   name: 'WIKI',
  //   module: 'wiki',
  //   query: '',
  //   out: false,
  //   url: '',
  //   login: false
  // }
]);
// const loginStatus = ref(false);

const { logout } = useUser();

const logoutAccount = () => {
  logout();
  location?.reload();
};

const { isLoginStatus, userInfo } = userStore;

const getCommentCount = () => {
  defaultApi.getCommentCount().then((res) => {
    messageCounts.value = res.data;
  });
};

onMounted(() => {
  if (isLoginStatus) {
    getCommentCount();
  }
});

defineExpose({
  getCommentCount,
  messageCounts,
});
</script>

<style lang="scss" scoped>
.top-header {
  height: 60px;
  background: #fff;
  padding: 0 20px;

  .nav-list {
    height: 60px;
    line-height: 60px;

    a {
      @apply text-black hover:text-sky-600 transition-all ease-out duration-100;
    }

    .router-link-exact-active {
      @apply text-sky-600 hover:text-sky-600 transition-all ease-out duration-100 font-bold;
    }
  }

  .left {
    display: flex;
    flex-flow: row nowrap;
    height: 60px;

    .logo {
      height: 22px;
    }
  }
}

@font-face {
  font-family: '阿里妈妈方圆体 VF Regular';
  src: url('//at.alicdn.com/wf/webfont/V0t7JYUpP7kr/v1zI407IHzWL.woff2') format('woff2'),
    url('//at.alicdn.com/wf/webfont/V0t7JYUpP7kr/Sj0wTmZQMCSq.woff') format('woff');
  font-display: swap;
}

.logo-text {
  font-family: '阿里妈妈方圆体 VF Regular';
  font-weight: 600;
  font-size: 22px;
}

.message-box-trigger {
  @apply w-[160px] h-[200px] bg-white rounded-md shadow-lg flex flex-col justify-center items-center;
  box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.1);
}

:deep(.arco-badge) {
  .arco-badge-number {
    font-size: 10px;
    line-height: 15px;
    height: 15px;
  }
}
</style>
