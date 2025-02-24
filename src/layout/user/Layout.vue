<template>
  <div class="user_setting">
    <div class="back">
      <router-link :to="{ name: 'UserHome', params: { id: userInfo.userId } }">
        <icon-left />
        返回个人主页</router-link
      >
    </div>
    <div class="w-full w-[1200px] flex flex-row flex-nowrap justify-between items-start mt-5">
      <div class="left w-[230px] bg-white h-[650px]">
        <ul class="flex flex-col pt-2">
          <router-link
            v-for="(nav, index) in sidenavs"
            :key="index"
            class="h-[50px] leading-[50px] block text-center font-bold hover:text-blue-600 hover:bg-blue-50 hover:rounded-md w-11/12 mx-auto"
            :to="{ name: nav.value }"
            :class="selectSideNav === nav.value ? 'text-blue-600 bg-blue-50 rounded-md' : ''"
          >
            <li class="flex flex-row flex-nowrap justify-center items-center" @click="selectNav(nav.value)">
              <icon-font :type="nav.icon" :size="20" class="mr-2 font-bold" />
              <span>{{ nav.label }}</span>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="right w-[950px] bg-white">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';
import { useUserStore } from '@/store';

const { userInfo } = useUserStore();

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });

const selectSideNav = ref('UserProfile');

const sidenavs = ref([
  {
    label: '个人资料',
    value: 'UserProfile',
    icon: 'swd-profile',
  },
  {
    label: '账号设置',
    value: 'UserAccount',
    icon: 'swd-user',
  },
  // {
  //   label: '通用设置',
  //   value: 'UserCommon',
  //   icon: 'swd-setting',
  // },
]);

onMounted(() => {
  const route = useRoute();
  selectSideNav.value = route.name as string;
});

const selectNav = (nav: string) => {
  // router.push({
  //   name:''
  // })
  selectSideNav.value = nav;
};

// const render = (icon: any) => {
//   return h(icon.icon, { class: '' });
//   Icon.
// };

// const createIcon = (icon: string) => {

//   render(h){
//     return h(icon, { class: 'container', style: { color: 'red' } })
//   }

//   // console.log(h(icon, { class: 'container', style: { color: 'red' } }));

//   // return h(icon, { class: 'container', style: { color: 'red' } });
//   // return document.createElement(icon);
// };
</script>

<style lang="scss" scoped>
.user_setting {
  @apply w-[1200px] mx-auto mt-[80px];
}
.back {
  @apply leading-[50px] h-[50px] bg-white px-5 text-blue-500 font-bold;
}
</style>
