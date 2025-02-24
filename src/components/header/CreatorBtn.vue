<template>
  <div class="creator-btn block">
    <a-trigger
      :popup-translate="activityList && activityList.length !== 0 ? [-50, 20] : [0, 20]"
      position="bottom"
      auto-fit-position
      :unmount-on-close="false"
      :blur-to-close="false"
      :click-to-close="false"
    >
      <a-button-group>
        <a-button type="primary" @click="gotoPage('CreatorHome')">内容创作管理 </a-button>
        <a-button type="primary" class="transform">
          <template #icon>
            <icon-down />
          </template>
        </a-button>
      </a-button-group>
      <template #content>
        <div class="creator-menu-wrap" :class="activityList && activityList.length !== 0 ? 'w-[280px]' : 'w-[200px]'">
          <div
            class="menu-list flex flex-row justify-around items-center mb-2"
            :class="activityList && activityList.length !== 0 ? 'flex-nowrap' : 'flex-wrap'"
          >
            <div
              class="flex flex-col justify-center items-center py-3 hover:bg-gray-100"
              :class="activityList && activityList.length !== 0 ? 'w-1/4' : 'w-1/3'"
              @click="gotoPage('editor')"
            >
              <icon-font type="swd-yuedu" :size="30" />
              <span class="text-xs mt-3">发布帖子</span>
            </div>
            <div
              class="flex flex-col justify-center items-center py-3 hover:bg-gray-100"
              :class="activityList && activityList.length !== 0 ? 'w-1/4' : 'w-1/3'"
              @click="gotoPage('stick')"
            >
              <icon-font type="swd-xinxi" :size="30" />
              <span class="text-xs mt-3">发布尺牍</span>
            </div>
            <div
              class="flex flex-col justify-center items-center py-3 hover:bg-gray-100"
              :class="activityList && activityList.length !== 0 ? 'w-1/4' : 'w-1/3'"
              @click="gotoPage('workEditor')"
            >
              <icon-font type="swd-tupian" :size="30" />
              <span class="text-xs mt-3">发布同人</span>
            </div>
            <!-- <div
              class="flex flex-col justify-center items-center py-3 hover:bg-gray-100"
              :class="activityList && activityList.length !== 0 ? 'w-1/4' : 'w-1/2'"
            >
              <icon-font type="swd-youxi" :size="30" />
              <span class="text-xs mt-3">发布游戏</span>
            </div> -->
            <!-- <div class="flex flex-col justify-center items-center py-3 hover:bg-gray-100 w-1/5">
              <icon-font type="swd-ziliao" :size="30" />
              <span class="text-xs mt-3">草稿箱</span>
            </div> -->
          </div>
          <!-- <a-divider margin="0" v-if="activityList && activityList.length!==0" /> -->
          <!-- <a-divider v-if="activityList && activityList.length !== 0" margin="0" /> -->
          <!-- <div v-if="activityList && activityList.length !== 0" class="activity-list mt-3">
            <div class="head flex flex-row justify-between items-center px-3">
              <span class="font-bold text-base">创作活动</span>
              <span class="cursor-pointer text-gray-400">查看更多 <span>></span></span>
            </div>
            <div class="list px-3 mt-2">
              <div
                v-for="(activity, index) in activityList"
                :key="index"
                class="h-10 w-full flex flex-row items-center justify-start"
              >
                <a-tag color="arcoblue" size="small">{{ activity.type }}</a-tag>
                <span class="ml-2 text-sm text-gray-700 hover:text-gray-500 block leading-10">{{
                  activity.title
                }}</span>
              </div>
            </div>
          </div> -->
        </div>
      </template>
    </a-trigger>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });

const show = ref(false);
const router = useRouter();

const activityList = ref([
  {
    title: '轩辕剑三攻略',
    type: '综合',
  },
  {
    title: '轩辕剑三同人',
    type: '同人创作',
  },
  {
    title: '轩辕剑三同人',
    type: '帖子征集',
  },
]);

const gotoPage = (page: string) => {
  router.push({ name: page });
};
</script>

<style lang="scss" scoped>
.creator-menu-wrap {
  padding: 10px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}
</style>
