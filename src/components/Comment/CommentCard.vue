<template>
  <div class="comment-card mb-[10px]">
    <div class="flex flex-row justify-start items-start">
      <div class="avatar">
        <a-avatar>
          <img :src="avatar" />
        </a-avatar>
      </div>
      <div class="infos ml-[10px] w-full">
        <div class="user_info flex flex-row justify-between items-center">
          <span class="text-sm text-gray-600">{{ nickname }}</span>
        </div>
        <div class="my-[10px] comment text-sm text-black leading-[28px]" v-html="content"></div>
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
          <!-- <a-trigger trigger="click">
            <icon-more :size="15" />
            <template #content>
              <div class="demo-basic w-full flex flex-row justify-center">
                <span
                  class="text-sm hover:bg-gray-100 w-[80px] p-2 flex flex-row flex-nowrap items-center justify-start shadow-gray-200 shadow-lg bg-white"
                  @click="openReportModal"
                  ><icon-exclamation-polygon-fill class="mr-2" size="15" />举报</span
                >
              </div>
            </template>
          </a-trigger> -->
        </div>
        <div class="mt-[10px]">
          <div v-if="showReplyCommentInput">
            <input-editor
              ref="replyEditorRef"
              v-model="replyForm.content"
              :placeholder="`回复@${nickname}：`"
              :max-stick-text-count="300"
              btn-text="回复"
              :show-input-editor="showReplyCommentInput && isLoginStatus"
              @submit="submitReply"
            >
              <template #offline>
                <div class="flex flex-col justify-center items-center h-[100px] bg-gray-100 rounded-md">
                  <span class="text-gray-400">登录后可评论</span>
                  <span class="mt-[10px]">
                    <a-button type="primary" size="mini" @click="injectHandle.openAuthModal('login')"
                      >登录/注册</a-button
                    >
                  </span>
                </div>
              </template>
            </input-editor>
          </div>
          <div class="reply">
            <reply-card
              v-for="reply in replys.list"
              :key="reply.replyId"
              :reply-id="reply.replyId"
              :replyer="reply.replyAccount"
              :receiver="reply.receivedAccount"
              :content="reply.content"
              :submit-time="reply.createdAt"
              @submit-reply="submitReplys($event, reply)"
            ></reply-card>
            <template v-if="replys.total > 10 && !listShow">
              <a-pagination
                size="mini"
                :total="replys.total"
                :page-size="10"
                :current="replyCurrent"
                show-total
                @change="changeReplyPage"
              >
                <template #total="{ total }">
                  <span class="text-gray-500 text-xs">{{ total }}条回复 </span></template
                ></a-pagination
              >
            </template>
            <template v-else-if="replys.total > 5 && listShow">
              <div
                class="block w-full mx-auto bg-gray-100 h-[30px] leading-[30px] text-center hover:bg-gray-200 hover:bg-gray-200 ease-in duration-300 text-xs"
                @click="routerUrl"
              >
                点击查看更多回复
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTimeFromNow } from '@/utils/format';
import { ReplyItemDto, commentReportFormDto, CommentDto } from '@/api/modules/default';
import { useUserStore } from '@/store';

defineOptions({
  name: 'CommentCard', // 给组件命名
});

const replyForm = reactive({
  content: '',
  images: [],
});

const { isLoginStatus } = useUserStore();

const replyEditorRef = ref<any>();

const emit = defineEmits<{
  (e: 'sendCommentReport', commentReportForm: commentReportFormDto, cb: (bool: boolean) => void): void;
  (e: 'submitReply', commentReplyForm: any): void;
  (e: 'reply', commentReplyForm: any): void;
  (e: 'changeReplyPage', current: number): void;
  (e: 'replyRouterUrl'): void;
}>();

interface Props {
  avatar: string;
  nickname: string;
  content: string;
  submitTime: string;
  replys: {
    list: Array<ReplyItemDto>;
    total: number;
  };
  replyCurrent?: number;
  listShow: boolean;
  commentId: number;
}
const injectReportHandle: any = inject('reportModal');
const injectHandle: any = inject('authModal');

const props = withDefaults(defineProps<Props>(), {});

// const openReportModal = () => {
//   if (isLoginStatus) {
//     injectReportHandle.openReportModal({
//       type: 'post_comment',
//       commentId: props.commentId,
//     });
//   } else {
//     injectHandle.openAuthModal('login');
//   }
// };

const showReplyCommentInput = ref(false);

const openReplyCommentInput = (name?: string) => {
  showReplyCommentInput.value = !showReplyCommentInput.value;
};

const submitReply = () => {
  emit('submitReply', replyForm);
  replyEditorRef.value.clear();
  showReplyCommentInput.value = false;
};

const submitReplys = (event: any, reply: any) => {
  const replyForms = {
    ...event,
    receiverId: reply.replyAccount.userId,
    replyInfo: reply,
  };
  emit('reply', replyForms);
};

const changeReplyPage = (current: number) => {
  emit('changeReplyPage', current);
};

const routerUrl = () => {
  emit('replyRouterUrl');
};
</script>

<style scoped></style>
