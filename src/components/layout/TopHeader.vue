<template>
  <div class="top-header flex flex-row justify-between items-center">
    <a-modal v-model:visible="logoutModal" @ok="logoutAccount">
      <template #title>退出账号</template> <span>是否确定退出账号？</span></a-modal
    >
    <div class="left flex flex-row justify-between items-center">
      <div class="logo nav-item">
        <router-link :to="{ name: 'home' }" class="logo flex flex-row flex-nowrap justify-start items-center w-full">
          <img
            src="http://files.swdwiki.com/tos-cn-i-8vrofckkw9/logo.svg"
            alt="轩辕天书"
            class="logo-img w-8 block mr-2"
          />
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
              <a class="text-black" :href="nav.url">{{ nav.name }}</a>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="right flex flex-row justify-between items-center">
      <!-- <div class="nav-item search mx-2">
        <search-box />
      </div> -->
      <div v-if="isLoginStatus" class="nav-item creater mx-2">
        <creator-btn />
      </div>
      <div class="nav-item menu mx-2">
        <div v-if="!isLoginStatus" class="no_login">
          <auth-btn></auth-btn>
        </div>
        <div v-else>
          <a-trigger trigger="click" :popup-translate="[-120, 0]" :show-arrow="false">
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
                      <span class="text-xs h-[25px] leading-[25px]">黑火能量：{{ userInfo.fire }}</span>
                    </div>
                  </div>
                  <div class="level-exp-box bg-blue-50 rounded-md mx-auto h-[45px] py-[5px] px-[10px]">
                    <div class="top text-xs flex flex-row justify-between text-blue-500 font-semibold mt-[3px]">
                      <span class="level"
                        >等级 LV.{{ userInfo.level?.level }}
                        <span class="level-content">{{ userInfo.level?.content }}</span></span
                      >
                      <span class="exp">{{ userInfo.exp }}/{{ userInfo.level?.maxExp }}</span>
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
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.follow }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">关注</span>
                      </div>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.fan }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">粉丝</span>
                      </div>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.like }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">点赞</span>
                      </div>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.stick }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">尺牍</span>
                      </div>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.post }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">文章</span>
                      </div>
                      <div class="flex flex-col justify-center items-center w-1/3 my-[15px]">
                        <span class="text-base text-black my-[3px] font-bold">{{ userInfo.count?.work }}</span>
                        <span class="text-sm text-gray-400 my-[3px] font-bold">同人作品</span>
                      </div>
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
import logo from '@/assets/svg/logo.svg';

const logoutModal = ref(false);
const userStore = useUserStore();

const route = useRoute();
console.log(route, '路由信息');
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
  // {
  //   name: '同人工坊',
  //   module: 'work',
  //   query: '',
  //   out: false,
  //   url: '',
  //   login: false,
  // },
  // {
  //   name: '活动',
  //   module: 'activity',
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
  location.reload();
};

const { isLoginStatus, userInfo } = userStore;
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
</style>
