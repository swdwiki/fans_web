<template>
  <div
    class="z-50 post-card group px-3 flex flex-row flex-nowrap justify-center items-center py-3 hover:bg-gray-100 border-b border-b-gray-100 w-full"
  >
    <a-modal v-model:visible="showReason" closeable :footer="false">
      <template #title>未通过原因</template>
      <span class="text-center leading-[30px] block p-[10px]">{{ props.post.reason }}</span>
    </a-modal>
    <div v-if="props.post.cover" class="left cover rounded-md relative">
      <img :src="props.post.cover" class="cover rounded-md object-cover" />
    </div>
    <div class="right flex flex-col items-start justify-between w-[100%]" :class="[post.cover ? 'ml-5 ' : '']">
      <router-link v-if="props.post.status === 3" :to="{ name: 'PostDetail', params: { postId: post.postId } }">
        <div class="font-bold text-black text-base block leading-7 flex flex-row justify-start items-center">
          <a-tag v-if="props.post.history" class="mr-2" :color="STATUS_LIST[props.post.status].color" size="small">{{
            STATUS_LIST[props.post.status].label
          }}</a-tag>
          <span> {{ props.post.title }}</span>
        </div>
        <span class="line-clamp-1 text-gray-400 leading-7">{{ props.post.desc }}</span>
      </router-link>
      <template v-else>
        <div class="font-bold text-black text-base leading-7 flex flex-row justify-start items-center">
          <a-tag v-if="props.post.history" class="mr-2" :color="STATUS_LIST[props.post.status].color" size="small">{{
            STATUS_LIST[props.post.status].label
          }}</a-tag>
          <span> {{ props.post.title }}</span>
        </div>
        <span class="line-clamp-1 text-gray-400 leading-7">{{ props.post.desc }}</span>
      </template>
      <div class="meta flex flex-row flex-nowrap items-center justify-between w-full">
        <div class="leading-7">
          <span v-if="showSubject" class="text-gray-400">{{ props.post.subject?.title }}</span>
          <a-divider direction="vertical" />
          <span class="text-gray-400">{{ formatTime(props.post.createdAt) }}</span>
          <a-divider direction="vertical" />
          <span class="text-gray-400"><icon-thumb-up class="mr-1" />{{ props.post.likeCount }}</span>
          <span class="text-gray-400 mx-2"><icon-eye class="mr-1" />{{ props.post.viewCount }}</span>
        </div>
        <div class="meta-right flex flex-row items-center justify-end flex-nowrap">
          <div class="inline-block">
            <a-tag v-for="(tag, index) in props.post.tags" :key="index" size="small" class="mx-1">
              <span class="text-gray-500">{{ tag.name }}</span>
            </a-tag>
          </div>
          <span v-if="showMore" ref="showPopRef" class="text-gray-400 relative leading-7 ml-5">
            <a-trigger position="bottom" trigger="click" auto-fit-position :unmount-on-close="false">
              <div class="hover:bg-gray-100">
                <icon-more />
              </div>
              <template #content>
                <div class="demo-basic flex flex-col justify-center items-center text-sm">
                  <span
                    v-if="props.post.history && props.post.status === 4"
                    class="block leading-10 hover:bg-gray-100 w-full text-center"
                    @click="showReason = true"
                    >未通过原因</span
                  >
                  <span
                    class="block leading-10 hover:bg-gray-100 w-full text-center"
                    @click="editEditor(props.post.postId)"
                    >帖子编辑</span
                  >
                  <a-popconfirm content="确定要上架/发布该帖子么？" @ok="upPost(props.post.postId)">
                    <span
                      v-if="props.post.history && props.post.status === 2"
                      class="block leading-10 hover:bg-gray-100 w-full text-center"
                      >帖子上架/发布</span
                    >
                  </a-popconfirm>
                  <a-popconfirm content="确定要下架该帖子么？" @ok="downPost(props.post.postId)">
                    <span
                      v-if="props.post.history && props.post.status === 3"
                      class="block leading-10 hover:bg-gray-100 w-full text-center"
                      >帖子下架</span
                    >
                  </a-popconfirm>
                  <a-popconfirm content="删除后无法找回，确定要删除该帖子么？" @ok="deletePost(props.post.postId)">
                    <span class="block leading-10 hover:bg-gray-100 w-full text-center">帖子删除</span>
                  </a-popconfirm>
                </div>
              </template>
            </a-trigger>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import useHeader from '@/hooks/header';
import dayjs from '@/utils/dayjs';

const userStore = useUserStore();
const { isLoginStatus } = userStore;

const showReason = ref(false);

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'update', id: number): void;
  (e: 'down', id: number): void;
  (e: 'up', id: number): void;
}>();

const props = defineProps({
  post: {
    type: Object,
    default: () => {
      return {
        title: '',
        desc: '',
        cover: '',
        tags: [],
        subjectId: 0,
        subject: {
          title: '',
        },
        plateId: 0,
        plates: [],
        author: {
          nickname: '',
        },
        likeCount: 0,
        viewCount: 0,
        createdAt: '',
        history: [
          {
            state: '',
            content: '',
          },
        ],
      };
    },
  },
  showSubject: {
    type: Boolean,
    default: true,
  },
  showMore: {
    type: Boolean,
    default: true,
  },
});

const showPopRef = ref<any>(null);

const downPost = (postId: number) => {
  emit('down', postId);
};

const deletePost = (postId: number) => {
  emit('delete', postId);
};

const upPost = (postId: number) => {
  emit('up', postId);
};

const editEditor = (postId: number) => {
  emit('update', postId);
};

const STATUS_LIST = [
  {
    label: '草稿',
    color: '#86909c',
  },
  {
    label: '审核中',
    color: '#ffb400',
  },
  {
    label: '未发布',
    color: '#165dff',
  },
  {
    label: '已发布',
    color: '#00b42a',
  },
  {
    label: '未通过',
    color: '#f53f3f',
  },
];

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
  z-index: 999;
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
