<template>
  <div class="creator_stick_card p-[15px] flex flex-row w-full">
    <router-link class="avatar" :to="`/u/${author.userId}`">
      <a-avatar :size="40">
        <img :src="author.avatar" />
      </a-avatar>
    </router-link>
    <div class="ml-[15px] w-full">
      <div class="nickname font-bold">
        <router-link :to="`/u/${author.userId}`">{{ author.nickname }}</router-link>
      </div>
      <div class="time_action flex flex-row flex-nowrap justify-between items-center h-[30px] leading-[30px]">
        <router-link :to="{ name: 'stickDetail', params: { id: stick.stickId } }" class="text-xs text-gray-400">
          <span class="block">{{ formatTimeFromNow(stick.submitTime) }}</span>
        </router-link>
        <div v-if="showMoreBtn" class="action">
          <a-trigger trigger="click">
            <icon-more :size="16" />
            <template #content>
              <div
                class="bg-white leading-[30px] flex flex-col justify-center items-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                <router-link
                  class="w-full block hover:bg-gray-100 py-[5px] px-[15px] text-center"
                  :to="{ name: 'stickDetail', params: { id: stick.stickId } }"
                  >查看详情</router-link
                >
                <a-popconfirm content="是否确定删除该尺牍?" @ok="deleteStick(stick.stickId)">
                  <span class="block w-full hover:bg-gray-100 py-[5px] px-[15px] cursor-pointer text-center"
                    >删除尺牍</span
                  >
                </a-popconfirm>
              </div>
            </template>
          </a-trigger>
        </div>
      </div>
      <div class="content w-full">
        <span class="leading-[30px]" v-html="content"></span>
        <div class="mt-[10px]">
          <more-images v-if="imgs && imgs.length !== 0" :author="author.nickname" :images="imgs"></more-images>
        </div>
      </div>
      <div v-if="theme" class="theme my-[10px]">
        <span
          v-if="theme && theme.name"
          class="bg-blue-100 font-bold py-[5px] px-[10px] text-xs rounded-xl text-blue-500"
          >{{ theme.name }}
          <icon-right v-if="theme && theme.themeId" :size="12" />
        </span>
      </div>
      <div class="data flex flex-row justify-start items-center my-[5px] leading-[28px] text-gray-400 text-sm">
        <div class="like">
          <span>点赞</span>
          <span class="ml-1">{{ stick.likeCount }}</span>
        </div>
        <div class="like ml-[20px]">
          <span>评论</span>
          <span class="ml-1">{{ Number(stick.commentCount) + Number(stick.replyCount) }}</span>
        </div>
      </div>
      <a-divider margin="0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { StickDto } from '@/api/modules/stick';
import { formatTimeFromNow } from '@/utils/format';
import { Images } from '@/api/modules/default';

interface Props {
  content: string;
  theme: { themeId: number; name: string };
  author: { nickname: string; avatar: string; userId: number };
  stick: StickDto;
  imgs: Array<Images>;
  showMoreBtn?: boolean;
}

const emit = defineEmits<{
  (e: 'delete', id: number): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  showMoreBtn: true,
});

const deleteStick = (stickId: number) => {
  emit('delete', stickId);
};
</script>

<style lang="scss" scoped></style>
