<template>
  <div class="comment-card w-full">
    <div class="flex flex-col justify-start items-start">
      <div class="flex flex-row justify-start items-center">
        <div class="avatar">
          <a-avatar :size="30">
            <img :src="replyer.avatar" />
          </a-avatar>
        </div>
        <div class="infos ml-[10px] w-full">
          <div class="user_info flex flex-row justify-start items-center">
            <span class="text-sm text-gray-600">{{ replyer.nickname }}</span>
            <span v-if="receiver && receiver.userId !== replyer.userId" class="text-sm text-gray-600"
              >回复@{{ receiver.nickname }}</span
            >
            <span class="text-sm text-gray-600">：</span>
            <div class="my-[10px] comment text-sm text-black leading-[28px]">{{ content }}</div>
          </div>
        </div>
      </div>
      <div class="w-full actions flex flex-row flex-nowrap text-xs justify-between items-center">
        <div class="flex flex-row justify-start items-center">
          <span class="text-gray-500">{{ formatTimeFromNow(submitTime) }}</span>
          <div
            class="ml-[20px]"
            :class="[showReplyCommentInput ? 'text-blue-600' : 'text-gray-500']"
            @click="openReplyCommentInput()"
          >
            <icon-message class="mr-[5px]" :size="12" />
            <span>{{ !showReplyCommentInput ? '回复' : '取消回复' }}</span>
          </div>
        </div>
        <!-- <more-btn type="comment" @send-report="addCommentReport($event, () => {})"></more-btn> -->
      </div>
      <div class="mt-[10px] w-full">
        <div v-if="showReplyCommentInput">
          <input-editor
            ref="replyEditorRef"
            v-model="replyForm.content"
            :placeholder="`回复@${replyer.nickname}：`"
            :max-stick-text-count="300"
            btn-text="回复"
            :show-input-editor="showReplyCommentInput && isLoginStatus"
            @submit="submitReply"
          >
            <template #offline>
              <div class="flex flex-col justify-center items-center h-[100px] bg-gray-100 rounded-md">
                <span class="text-gray-400">登录后可评论</span>
                <span class="mt-[10px]">
                  <a-button type="primary" size="mini" @click="injectHandle.openAuthModal('login')">登录/注册</a-button>
                </span>
              </div>
            </template>
          </input-editor>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTimeFromNow } from '@/utils/format';
import { Author } from '@/api/modules/default';
import { useUserStore } from '@/store';

const injectHandle: any = inject('authModal');
const { isLoginStatus } = useUserStore();

defineOptions({
  name: 'CommentCard', // 给组件命名
});

const replyForm = reactive({
  content: '',
  images: [],
});

const replyEditorRef = ref<any>();

const emit = defineEmits<{
  // (e: 'sendCommentReport', commentReportForm: commentReportFormDto, cb: (bool: boolean) => void): void;
  (e: 'submitReply', commentReplyForm: any): void;
}>();

interface Props {
  replyer: Author;
  receiver?: Author;
  content: string;
  submitTime: string;
}
const props = withDefaults(defineProps<Props>(), {});

const addCommentReport = (event: any, cb: (bool: boolean) => void) => {};

const showReplyCommentInput = ref(false);

const openReplyCommentInput = () => {
  showReplyCommentInput.value = !showReplyCommentInput.value;
};

const submitReply = () => {
  emit('submitReply', replyForm);
  replyEditorRef.value.clear();
};

const clear = () => {
  showReplyCommentInput.value = false;
};

defineExpose({
  clear,
});
</script>

<style scoped></style>
