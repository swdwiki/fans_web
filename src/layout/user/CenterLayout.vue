<template>
  <div class="user_setting mb-[20px]">
    <div class="w-[1200px] flex flex-row flex-nowrap justify-between items-start mt-5">
      <div class="left w-[230px] bg-white h-[450px] sticky top-[80px]">
        <ul class="flex flex-col pt-2">
          <router-link
            v-for="(nav, index) in sidenavs"
            :key="index"
            class="h-[60px] leading-[60px] block text-center font-bold hover:text-blue-600 hover:bg-blue-50 hover:rounded-md w-11/12 mx-auto my-[10px]"
            :to="{ name: nav.value }"
            :class="selectSideNav === nav.value ? 'text-blue-600 bg-blue-50 rounded-md' : ''"
          >
            <li class="flex flex-row flex-nowrap justify-center items-center" @click="selectNav(nav.value)">
              <icon-font
                :type="selectSideNav === nav.value ? nav.selectIcon : nav.icon"
                :size="24"
                class="mr-2 font-bold text-red-400"
              />
              <span>{{ nav.label }}</span>
            </li>
          </router-link>
        </ul>
      </div>
      <div class="right w-[950px]">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });

const selectSideNav = ref('UserProfile');

const sidenavs = ref([
  {
    label: '每日签到',
    value: 'UserSignin',
    icon: 'swd-signin-empty',
    selectIcon: 'swd-signin',
  },
  // {
  //   label: '洞天宝盒',
  //   value: 'UserLottery',
  //   icon: 'swd-signin-empty',
  //   selectIcon: 'swd-signin',
  // },
  {
    label: '成长等级',
    value: 'UserLevel',
    icon: 'swd-shuju-empty',
    selectIcon: 'swd-shuju',
  },
  {
    label: '黑火兑换',
    value: 'UserWelfare',
    icon: 'swd-duihuan-empty',
    selectIcon: 'swd-duihuan',
  },
  // {
  //   label: '我的背包',
  //   value: 'UserItems',
  //   icon: 'swd-shangpin-empty',
  //   selectIcon: 'swd-shangpin',
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
  @apply w-[1200px] mx-auto mt-[100px];
}
.back {
  @apply leading-[50px] h-[50px] bg-white px-5 text-blue-500 font-bold;
}
</style>
