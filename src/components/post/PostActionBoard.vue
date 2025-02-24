<template>
  <div ref="actionBoardRef" class="post-action-board fixed top-[240px] z-[100]">
    <div
      :class="[!showAvatar ? 'hidden' : 'block']"
      class="w-[48px] h-[48px] my-[20px] transition-all duration-100 relative"
    >
      <a-avatar :size="48">
        <img :src="avatar" />
      </a-avatar>
      <a-button
        v-if="!showFollowBtn"
        class="absolute bottom-[8px]"
        size="mini"
        type="primary"
        @click="followAction(true)"
        >关注</a-button
      >
    </div>
    <div class="w-[48px] h-[48px] my-[20px]">
      <a-badge :count="likeCount" :offset="[-2, 5]">
        <a-tooltip background-color="#3491FA" :content="!showLikeStatus ? '点赞' : '已点赞'" position="right" mini>
          <a-button shape="circle" class="w-full" @click="likeAction">
            <div
              class="flex flex-row justify-center items-center w-[48px] h-[48px]"
              :class="[showLikeStatus ? 'text-blue-400' : '']"
            >
              <icon-thumb-up :size="20" />
            </div>
          </a-button>
        </a-tooltip>
      </a-badge>
    </div>
    <div class="w-[48px] h-[48px] my-[20px]">
      <a-badge :count="commentCount" :offset="[-2, 5]">
        <a-tooltip background-color="#3491FA" content="评论" position="right" mini>
          <a-button shape="circle" class="w-full" @click="commentAction">
            <div class="flex flex-row justify-center items-center w-[48px] h-[48px]">
              <icon-message :size="20" />
            </div>
          </a-button>
        </a-tooltip>
      </a-badge>
    </div>
    <div class="w-[48px] h-[48px] my-[20px]">
      <a-tooltip background-color="#3491FA" content="举报" position="right" mini>
        <a-button shape="circle" class="w-full" @click="report">
          <div class="flex flex-row justify-center items-center w-[48px] h-[48px]">
            <icon-exclamation-circle-fill :size="20" />
          </div>
        </a-button>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import useScroll from '@/hooks/scroll';
import { useUserStore } from '@/store';

const injectReportHandle: any = inject('reportModal');
const injectHandle: any = inject('authModal');
const { isLoginStatus } = useUserStore();

const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  showFollowBtn: {
    type: Boolean,
    default: true,
  },
  showLikeStatus: {
    type: Boolean,
    default: false,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  postId: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits<{
  (e: 'followAction', status: boolean): void;
  (e: 'likeAction'): void;
  (e: 'commentAction'): void;
  (e: 'reportAction'): void;
}>();

const actionBoardRef = ref(null);

const { scrollTop } = useScroll(actionBoardRef.value);
const showAvatar = ref(true);

const followAction = (status: boolean) => {
  emit('followAction', status);
};

const likeAction = () => {
  emit('likeAction');
};

const commentAction = () => {
  emit('commentAction');
};

const report = () => {
  if (isLoginStatus) {
    injectReportHandle.openReportModal({
      type: 'post',
      postId: props.postId,
    });
  } else {
    injectHandle.openAuthModal('login');
  }
};

watch(scrollTop, (newScrollTop) => {
  // console.log(newScrollTop, 'newScrollTop_css');
  if (newScrollTop > 300) {
    showAvatar.value = false;
  } else {
    showAvatar.value = true;
  }
});
</script>

<style lang="scss" scoped>
:deep(.arco-btn-size-mini) {
  height: 17px;
  padding: 0 10px;
}
:deep(.arco-btn-shape-circle) {
  width: 48px;
  height: 48px;
  background: #fff;
}
.post-action-board {
  left: calc((100vw - 1200px) / 2.7);
  width: 60px;
}
</style>
