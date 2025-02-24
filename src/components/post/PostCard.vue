<template>
  <div
    class="post-card group px-5 flex flex-row flex-nowrap justify-center items-center py-3 hover:bg-gray-50 border-b border-b-gray-100"
  >
    <div v-if="post.cover" class="left cover rounded-md">
      <img :src="`${post.cover}?w=260`" class="cover rounded-md object-cover" />
    </div>
    <div class="right flex flex-col items-start justify-between w-[100%]" :class="[post.cover ? 'ml-5 ' : '']">
      <router-link :to="{ name: 'PostDetail', params: { postId: post.postId } }">
        <div class="font-bold text-black text-base block leading-7">
          <a-tag v-if="post.top || post.subjectTop || post.plateTop" class="mr-[5px]" color="blue">置顶</a-tag
          ><span> {{ post.title }}</span>
        </div>
        <span class="line-clamp-1 text-gray-400 leading-7">{{ post.desc }}</span>
      </router-link>
      <div class="meta flex flex-row flex-nowrap items-center justify-between w-full">
        <div class="meta-left leading-7 text-xs">
          <a-trigger
            position="top"
            :popup-translate="[0, -10]"
            :show-arrow="true"
            :arrow-class="['border border-gray-200 shadow-gray-200 shadow-2xl']"
          >
            <span class="text-gray-400">{{ post.author.nickname }}</span>
            <template #content>
              <div
                class="userinfo bg-white w-[280px] border border-gray-200 p-[15px] shadow-gray-200 shadow-2xl rounded-md"
              >
                <div class="">
                  <router-link
                    :to="{ name: 'UserHome', params: { id: post.author.userId } }"
                    class="flex flex-row my-[15px]"
                  >
                    <a-avatar :size="50">
                      <img class="object-cover" :src="post.author.avatar" />
                    </a-avatar>
                    <div class="content flex flex-col ml-[5px]">
                      <span class="font-bold text-[16px] leading-6">{{ post.author.nickname }}</span>
                      <span class="text-xs text-gray-400 leading-6">{{
                        post.author.short || '这个人很懒什么都没有写'
                      }}</span>
                    </div>
                  </router-link>
                  <div class="action mx-auto mt-[15px]">
                    <a-popconfirm
                      v-if="followStatus"
                      content="是否取消关注？"
                      @ok="followAction(post.author.userId, false)"
                    >
                      <a-button long type="outline">已关注</a-button>
                    </a-popconfirm>
                    <a-button v-else long type="primary" @click="followAction(post.author.userId, false)"
                      >关注</a-button
                    >
                  </div>
                </div>
                <a-divider :margin="15" />
                <div class="flex flex-row justify-around items-center mb-[5px]">
                  <router-link
                    :to="{ name: 'UserHome', params: { id: post.author.userId }, query: { type: 'follow' } }"
                    class="flex flex-col items-center justify-center"
                  >
                    <span class="text-black text-[16px]">{{ post.author.followCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">关注</span>
                  </router-link>
                  <router-link
                    :to="{ name: 'UserHome', params: { id: post.author.userId }, query: { type: 'fan' } }"
                    class="flex flex-col items-center justify-center"
                  >
                    <span class="text-black text-[16px]">{{ post.author.fanCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">粉丝</span>
                  </router-link>
                  <router-link
                    :to="{ name: 'UserHome', params: { id: post.author.userId }, query: { type: 'post' } }"
                    class="flex flex-col items-center justify-center"
                  >
                    <span class="text-black text-[16px]">{{ post.author.postCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">帖子</span>
                  </router-link>
                </div>
              </div>
            </template>
          </a-trigger>
          <a-divider direction="vertical" />
          <span v-if="showSubject && post.subject" class="text-gray-400"
            >{{ post.subject && post.subject.title }}-{{ post.plates[0].name }}</span
          >
          <a-divider direction="vertical" />
          <span class="text-gray-400">{{ formatTime(post.createdAt) }}</span>
          <a-divider direction="vertical" />
          <span class="text-gray-400"><icon-thumb-up class="mr-1" />{{ post.likeCount }}</span>
          <span class="text-gray-400 mx-2"><icon-eye class="mr-1" />{{ post.viewCount }}</span>
          <span
            v-if="isLoginStatus && showMore"
            ref="showPopRef"
            class="hidden group-hover:inline-block text-gray-400 mx-4 relative"
          >
            <a-trigger
              :popup-container="showPopRef"
              trigger="hover"
              position="bottom"
              auto-fit-position
              :unmount-on-close="false"
              popup-hover-stay
            >
              <icon-more />
              <template #content>
                <div class="demo-basic w-full">
                  <span
                    class="text-sm hover:bg-gray-100 w-full p-2 flex flex-row flex-nowrap items-center justify-start"
                    @click="openReportModal"
                    ><icon-exclamation-polygon-fill class="mr-2" size="15" />举报</span
                  >
                </div>
              </template>
            </a-trigger>
          </span>
        </div>
        <div v-if="post.tags && post.tags.length" class="meta-right block">
          <template v-for="(tag, index) in post.tags" :key="index">
            <a-tag v-if="index < 2" size="small" class="mx-1">
              <span class="text-gray-500">{{ tag.name }}</span>
            </a-tag>
          </template>
        </div>
        <div v-else class="meta-right block">
          <template v-for="(tag, index) in post.tagList" :key="index">
            <a-tag v-if="index < 2" size="small" class="mx-1">
              <span class="text-gray-500">{{ tag }}</span>
            </a-tag>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import defaultApi from '@/api/modules/default';
import { Post } from '@/api/modules/post';
import dayjs from '@/utils/dayjs';

const userStore = useUserStore();
const { isLoginStatus } = userStore;

const injectReportHandle: any = inject('reportModal');
const injectHandle: any = inject('authModal');

interface Props {
  post: Post;
  showSubject: boolean;
  showMore: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showMore: true,
  showSubject: true,
});

const followStatus = ref(!!(props.post.author.myFollow && props.post.author.myFollow > 0));

const showPopRef = ref<any>(null);

const openReportModal = () => {
  if (isLoginStatus) {
    injectReportHandle.openReportModal({
      type: 'post',
      postId: props.post.postId,
    });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const followAction = async (followId: number, status: boolean) => {
  if (isLoginStatus) {
    await defaultApi
      .follow({
        followId,
        status,
      })
      .then((res) => {
        if (res.code === 0) {
          if (res.data) {
            Message.success('关注成功');
            followStatus.value = true;
          } else {
            Message.success('已成功取消关注');
            followStatus.value = false;
          }
        }
      });
  } else {
    injectHandle.openAuthModal('login');
  }
};
const formatTime = (time: string) => {
  return dayjs(new Date(time)).fromNow();
};
</script>

<style lang="scss" scoped>
.post-card {
  .cover {
    width: 110px;
    height: 75px;
  }
}

.demo-basic {
  width: 100px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  // text-align: center;
}

.custom-radio-card {
  padding: 10px 16px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  box-sizing: border-box;
  // width: 180px;
}

.custom-radio-card-mask {
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked .custom-radio-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>
