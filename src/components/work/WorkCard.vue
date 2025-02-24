<template>
  <div
    class="work-box_card_item delay-50 relative"
    :style="{
      width: Number.isNaN(Number(width)) ? width : width + 'px',
    }"
  >
    <template v-if="showStatus">
      <a-tag class="absolute top-[5px] left-[5px] cursor-pointer z-[999]" :color="statusOption[status - 1].color">{{
        statusOption[status - 1].label
      }}</a-tag>
    </template>
    <div class="cover px-[2%] pt-[2%]">
      <router-link class="relative" :to="{ name: 'workDetail', params: { id: work.workId } }" target="_blank">
        <img
          v-if="work.cover"
          class="rounded-md object-cover transition-[filter] duration-500"
          :style="{
            height: Number.isNaN(Number(height)) ? height : height + 'px',
            width: Number.isNaN(Number(width)) ? width : width + 'px',
          }"
          :src="`${work.cover}?w=280&h=210${work.isR18 ? '&blur=1' : ''}`"
        />
        <div
          v-else
          class="rounded-md p-[10px] bg-gray-50 text-center flex flex-col justify-center items-center"
          :style="{
            backgroundImage: `url(${getAssetsFile('work_bg.png', 'img')})`,
            width: Number.isNaN(Number(width)) ? width : Number(width) - 10 + 'px',
            height: Number.isNaN(Number(height)) ? height : height + 'px',
          }"
        >
          <span class="w-full text-2xl text-center font-bold line-clamp-2 text-ellipsis">{{ work.title }}</span>
        </div>
        <a-tag v-if="work.isR18" :color="work.isGrotesque ? '#f53f3f' : '#7816ff'" class="absolute top-0 left-0">{{
          work.isGrotesque ? 'G向' : '18+'
        }}</a-tag>
      </router-link>
    </div>
    <div class="info px-[2%] py-[2%]">
      <router-link :to="{ name: 'workDetail', params: { id: work.workId } }" target="_blank" class="mb-[10px] block">
        <span class="cursor-pointer font-semibold text-[14px]">{{ work.title }}</span>
      </router-link>
      <div class="data flex flex-row justify-between items-center mt-[5px]">
        <div class="cate">
          <a-tag color="red" size="small">{{ work.parentCate.name }}</a-tag>
        </div>
        <div class="flex flex-row justify-start items-center flex-nowrap w-full ml-[10px]">
          <span class="text-gray-500 mr-2 text-[12px] flex flex-row items-center"
            ><icon-eye :size="12" class="mr-[2px]" />{{ work.viewCount }}</span
          >
          <span class="text-gray-500 mr-2 text-[12px] flex flex-row items-center"
            ><icon-message :size="12" class="mr-[2px]" />{{ work.commentCount }}</span
          >
          <span class="text-gray-500 mr-2 text-[12px] flex flex-row items-center"
            ><icon-thumb-up :size="12" class="mr-[2px]" />{{ work.likeCount }}</span
          >
        </div>
        <div v-if="showMore" class="text-gray-400">
          <a-trigger trigger="click" show-arrow position="bottom" :scroll-to-close="true">
            <div class="author">
              <icon-more :size="15" />
            </div>
            <template #content>
              <slot name="more_action" />
            </template>
          </a-trigger>
        </div>
      </div>
      <div class="mt-[10px] flex flex-row justify-between items-center">
        <div class="author">
          <a-avatar :size="20">
            <img :src="work.author.avatar" />
          </a-avatar>
          <span class="text-[12px] text-gray-600 ml-[5px]">{{ work.author.nickname }}</span>
        </div>
        <!-- <a-trigger trigger="hover" :popup-translate="[0, -10]" show-arrow position="top">
          <div class="author">
            <a-avatar :size="20">
              <img src="https://img.zcool.cn/community/007ca059a59a20a8012028a981f3ce.jpg" />
            </a-avatar>
            <span class="text-[12px] text-gray-600 ml-[5px]">{{ work.author.nickname }}</span>
          </div>
          <template #content>
            <div class="demo-arrow">
              <div class="author-info flex flex-row justify-between items-center">
                <div class="info">
                  <a-avatar :size="48">
                    <img src="https://img.zcool.cn/community/007ca059a59a20a8012028a981f3ce.jpg" />
                  </a-avatar>
                  <span class="text-[12px] text-gray-600 ml-[5px]">{{ work.author.nickname }}</span>
                </div>
                <a-button type="primary" shape="round" size="large" class="w-[100px]">关注</a-button>
              </div>
              <div class="work-list"></div>
            </div>
          </template>
        </a-trigger> -->
        <div class="">
          <a-tag>{{ work.cate.name }}</a-tag>
        </div>
        <!-- <div class="cate">
          <a-tag size="small">同人绘画</a-tag>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WorkItem, Works } from '@/api/modules/work';
import { getAssetsFile } from '@/utils/format';

interface Props {
  work: Works & WorkItem;
  showMore: boolean;
  showStatus: boolean;
  status?: number;
  width?: number | string;
  height?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  showMore: false,
  showStatus: false,
  status: 1,
  width: 280,
  height: 210,
});
const statusOption = [
  {
    label: '已发布',
    color: '#f5a623',
  },
  {
    label: '审核未通过',
    color: '#52c41a',
  },
  {
    label: '下架',
    color: '#ff4d4f',
  },
];
</script>

<style lang="scss" scoped>
.work-box_card_item {
  @apply m-[10px] 2xl:my-[10px] 2xl:mx-[8px] transition ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-white hover:rounded-md duration-300;
  // margin: 10px calc(80px / 10);

  position: relative;
  // float: left;
  margin-bottom: 15px;
  border-radius: 5px;
  transition: all 0.2s;
  // height: 300px;

  // &:nth-child(4n-3) {
  //   margin: 10px calc(80px / 6) 10px 0px;
  // }

  // &:nth-child(4n) {
  //   margin: 10px 0px 15px calc(80px / 6);
  // }
}

.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  padding: 10px;
  width: 200px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
}
</style>
