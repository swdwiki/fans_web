<template>
  <div class="creator flex flex-row flex-nowrap mx-auto justify-between">
    <div class="sidebar rounded-sm bg-white flex flex-col items-start justify-start sticky top-[80px] h-[600px]">
      <div class="creator-btn w-11/12 mx-auto block">
        <a-trigger
          trigger="click"
          :popup-translate="[5, 35]"
          position="right"
          auto-fit-position
          :unmount-on-close="false"
          :blur-to-close="false"
          :click-to-close="false"
        >
          <a-button long type="primary" size="large" class="mb-2">内容创作 </a-button>
          <template #content>
            <div class="creator-menu-wrap w-[240px]">
              <div class="menu-list flex flex-row justify-around items-center mb-2 flex-wrap">
                <div
                  class="flex flex-col justify-center items-center py-3 hover:bg-gray-100 w-1/3"
                  @click="gotoPage('editor')"
                >
                  <icon-font type="swd-yuedu" :size="30" />
                  <span class="text-xs mt-3">发布帖子</span>
                </div>
                <div
                  class="flex flex-col justify-center items-center py-3 hover:bg-gray-100 w-1/3"
                  @click="gotoPage('stick')"
                >
                  <icon-font type="swd-xinxi" :size="30" />
                  <span class="text-xs mt-3">发布尺牍</span>
                </div>
                <div
                  class="flex flex-col justify-center items-center py-3 hover:bg-gray-100 w-1/3"
                  @click="gotoPage('workEditor')"
                >
                  <icon-font type="swd-tupian" :size="30" />
                  <span class="text-xs mt-3">发布同人</span>
                </div>
                <!-- <div class="flex flex-col justify-center items-center py-3 hover:bg-gray-100 w-1/2">
                  <icon-font type="swd-youxi" :size="30" />
                  <span class="text-xs mt-3">发布游戏</span>
                </div> -->
              </div>
            </div>
          </template>
        </a-trigger>
      </div>
      <div class="">
        <a-menu
          :style="{ width: '200px' }"
          :collapsed="false"
          :auto-open-selected="true"
          auto-open
          :selected-keys="selectMenuKey"
          @menu-item-click="changeMenuKey($event)"
        >
          <template v-for="menu in menuList">
            <template v-if="!menu.showChild">
              <a-menu-item :key="menu.value">
                <template #icon><icon-home v-if="menu.value === 'CreatorHome'" :size="18" /></template>
                <span>{{ menu.label }}</span>
              </a-menu-item>
            </template>
            <template v-else>
              <a-sub-menu :key="menu.value">
                <template #icon>
                  <icon-apps v-if="menu.value === 'ContentCreator'" />
                  <icon-bar-chart v-if="menu.value === 'DataCreator'" />
                  <icon-question v-if="menu.value === 'HelpCreator'" />
                </template>
                <template #title>{{ menu.label }}</template>
                <template v-if="menu.showChild && menu.children && menu.children.length !== 0">
                  <!-- <template v-for="child in menu.children" :key="child.value">
                    <router-link v-if="child.router" class="w-full" :to="{ name: child.value, query: child.params }">
                      <a-menu-item>{{ child.label }} </a-menu-item></router-link
                    >
                    <span v-else>
                      <a-menu-item>{{ child.label }} </a-menu-item></span
                    >
                  </template> -->
                  <a-menu-item v-for="child in menu.children" :key="child.value" class="w-full block">
                    <span class="w-full">{{ child.label }}</span>
                  </a-menu-item>
                </template>
              </a-sub-menu>
            </template>
          </template>
        </a-menu>
      </div>
    </div>
    <div class="content mb-[110px]">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });

const selectMenuKey = ref<Array<string>>([]);
const route = useRoute();
const router = useRouter();

onMounted(() => {
  selectMenuKey.value = [route.name as string];
});

interface Menu {
  label: string;
  showChild: boolean;
  router?: boolean;
  params?: any;
  value: string;
  children: Array<Menu | undefined>;
}

const menuList = [
  {
    label: '首页',
    showChild: false,
    value: 'CreatorHome',
  },
  {
    label: '内容管理',
    value: 'ContentCreator',
    showChild: true,
    children: [
      {
        label: '帖子管理',
        value: 'PostsCreator',
        showChild: false,
        router: true,
        params: {
          status: 'all',
        },
      },
      {
        label: '专栏管理',
        value: 'ColumnCreator',
        showChild: false,
        router: true,
        params: {
          status: 'all',
        },
      },
      {
        label: '尺牍管理',
        value: 'SticksCreator',
        showChild: false,
        router: true,
        params: {
          status: 'all',
        },
      },
      // {
      //   label: '连载管理',
      //   value: 'SerializeCreator',
      //   showChild: false,
      //   router: true,
      //   params: {
      //     status: 'all',
      //   },
      // },
      {
        label: '同人作品管理',
        value: 'WorkCreator',
        showChild: false,
        router: true,
        params: {
          status: 'all',
        },
      },
    ],
  },
  // {
  //   label: '数据管理',
  //   value: 'DataCreator',
  //   showChild: true,
  //   children: [
  //     {
  //       label: '内容数据',
  //       value: 'ContentDataCreator',
  //       showChild: false,
  //     },
  //   ],
  // },
  {
    label: '创作帮助',
    value: 'HelpCreator',
    showChild: true,
    children: [
      // {
      //   label: '创作活动',
      //   value: 'ActivityCreator',
      //   showChild: false,
      // },
      {
        label: '常见问题',
        value: 'QuestionCreator',
        showChild: false,
        router: true,
      },
    ],
  },
];

const changeMenuKey = (key: string) => {
  const result: { isChild: boolean; value: Menu } = {
    isChild: false,
    value: {
      label: '',
      showChild: true,
      value: '',
      children: [],
    },
  };

  menuList.forEach((menu: any) => {
    if (menu.showChild) {
      const childIndex = menu.children.findIndex((child: any) => child.value === key);
      if (childIndex > -1) {
        result.isChild = true;
        result.value = menu?.children[childIndex];
      }
    } else if (menu.value === key) {
      result.isChild = false;
      result.value = menu;
    }
  });
  selectMenuKey.value = [key as string];

  if (result.isChild) {
    router.push({
      name: key,
      query: {
        ...result.value.params,
      },
    });
    if (route.name === key) {
      window.location.reload();
    }
  } else {
    router.push({
      name: key,
    });
  }
};

const gotoPage = (page: string) => {
  router.push({ name: page });
};
</script>

<style lang="scss" scoped>
.creator {
  @apply mt-[80px] w-[1200px];
}
.sidebar {
  // position: fixed;
  width: 200px;
  // top: 7rem;
  // bottom: 0;
  // z-index: 2;
  overflow: hidden;
  margin-bottom: 24px;
  padding: 12px 0;
  // min-height: 500px;
  // max-height: 750px;
}
.content {
  width: 980px;
  // margin-top: 24px;
  // margin-left: 220px;
}

.creator-menu-wrap {
  padding: 10px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>
