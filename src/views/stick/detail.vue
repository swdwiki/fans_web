<template>
  <div class="stick-detail">
    <div class="w-[720px] mr-[20px]">
      <a-skeleton v-if="loading" animation class="w-full bg-white p-10">
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <a-skeleton-shape />
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
      <stick-card
        v-else
        :list-show="false"
        :comments="comments"
        :comment-total="commentCount"
        :author="stick.author"
        :show-follow-btn="true"
        :show-more-icon="true"
        :content="stick.content"
        :imgs="stick.imgList"
        :stick="stick"
        :like-count="stick.likeCount"
        :show-comment-list="true"
        :comment-current="commentCurrent"
        @submit-reply="submitReply"
        @follow="follow($event, true)"
        @change-comment-page="changeCommentPage"
        @submit-comment="submitComment"
        @reply="reply"
        @change-reply-page="changeReplyPage"
      />
    </div>
    <div class="post_info w-[320px] ml-[20px] flex flex-col sticky top-[80px]">
      <a-skeleton v-if="loading" animation class="w-full bg-white p-10">
        <a-space direction="vertical" :style="{ width: '100%' }" size="large">
          <a-skeleton-shape />
          <a-skeleton-line :rows="5" />
        </a-space>
      </a-skeleton>
      <template v-else>
        <div class="author_card bg-white mb-5 p-5">
          <div class="profile flex flex-row justify-start items-center h-[60px]">
            <a-avatar :size="50">
              <img :src="stick.author.avatar" />
            </a-avatar>
            <div class="flex flex-col justify-between items-start ml-2">
              <span class="font-bold text-base h-[25px] leading-[25px]">{{ stick.author.nickname }}</span>
              <span class="text-gray-400 text-xs h-[25px] leading-[25px]">{{
                stick.author.desc || '他好像什么都没有写'
              }}</span>
            </div>
          </div>
          <div class="amount_list flex flex-row flex-nowrap justify-around items-center px-5 my-2">
            <div class="flex flex-col justify-center items-center">
              <span class="text-base text-black my-1 font-bold">{{ stick.author.stickCount }}</span>
              <span class="text-sm text-gray-400 my-1 font-bold">尺牍</span>
            </div>
            <div class="flex flex-col justify-center items-center">
              <span class="text-base text-black my-1 font-bold">{{ stick.author.followCount }}</span>
              <span class="text-sm text-gray-400 my-1 font-bold">粉丝</span>
            </div>
          </div>
          <div class="card_handle">
            <div v-if="stick.author.userId !== userInfo.userId">
              <a-button
                v-if="!followStatus"
                class="w-full"
                size="large"
                type="primary"
                @click="follow(stick.author.userId, true)"
                >关注</a-button
              >
              <a-popconfirm v-else content="确定取消关注么？" @ok="follow(stick.author.userId, false)">
                <a-button
                  class="w-full"
                  size="large"
                  :status="nofollow ? 'danger' : undefined"
                  @mouseleave="nofollow = false"
                  @mousemove="nofollow = true"
                  >{{ nofollow ? '取消关注' : '已关注' }}</a-button
                >
              </a-popconfirm>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import stickApi, { StickDto } from '@/api/modules/stick';
import { useUserStore } from '@/store';
import defaultApi, { CommentDto, CommentInfoDto } from '@/api/modules/default';
import useLoading from '@/hooks/loading';

const { userInfo, isLoginStatus } = useUserStore();

// const router = useRouter();
const stick = ref<StickDto>({
  stickId: 0,
  author: {
    userId: 0,
    nickname: '',
    avatar: '',
  },
  content: '',
  imgList: [],
  submitTime: '',
  theme: {},
  comments: {
    list: [],
    total: 0,
  },
  commentCount: 0,
  myFollow: 0,
});

const commentCurrent = ref(1);

const route = useRoute();
const router = useRouter();
const { loading, setLoading } = useLoading();
const nofollow = ref(false);
const followStatus = ref(false);
const comments = ref<Array<CommentInfoDto>>([]);
const commentCount = ref<number>(0);

const fetchData = () => {
  const { id } = route.params;
  stickApi
    .getStickDetail({
      stickId: id,
    })
    .then((res) => {
      stick.value = res.data.stick;
      comments.value = res.data.comments.list;
      followStatus.value = res.data.stick.myFollow > 0;
      commentCount.value = res.data.comments.total;
      setLoading(false);
    })
    .catch((err) => {
      // Message.error()
      // Message.error(err.message);
      setTimeout(() => {
        // router.back();
      }, 1000);
      // setLoading(false);
    });
};

const injectHandle: any = inject('authModal');

const follow = (userId: number, status: boolean) => {
  if (isLoginStatus) {
    defaultApi
      .follow({ followId: userId, status })
      .then((res) => {
        if (res.code === 0) {
          Message.success(res.data ? '已关注' : '已取消关注');
          followStatus.value = res.data;
          stick.value.myFollow = res.data ? 1 : 0;
        } else {
          Message.error(res.message || '');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const submitComment = (form: any) => {
  stickApi
    .submitStickComment({
      ...form,
      stickId: stick.value.stickId,
    })
    .then((res) => {
      if (res.code === 0) {
        comments.value.unshift({
          ...res.data,
          stickId: stick.value.stickId,
          commentAccount: userInfo,
          replys: {
            list: [],
            total: 0,
          },
        });
      }
    });
};

const submitReply = (replyForms: any) => {
  const { commentAccount, commentId, replyForm, receiverId, stickId } = replyForms;
  console.log(replyForms, 'submitReply');
  const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);
  stickApi
    .submitStickCommentReply({
      ...replyForm,
      receiverId,
      commentId,
      stickId,
    })
    .then((res) => {
      if (res.code === 0) {
        Message.success('回复成功');
        if (!comments.value[commentIndex].replys) {
          comments.value[commentIndex].replys = {
            list: [],
            total: 0,
          };
        }
        comments.value[commentIndex].replys.list.unshift({
          receiverAccount: commentAccount,
          receivedAccountId: receiverId,
          ...res.data,
          stickId,
          replyAccount: userInfo,
          replyAccountId: userInfo.userId,
        });
        comments.value[commentIndex].replys.total += 1;
      } else {
        Message.error(res.message || '');
      }
    });
};

const changeCommentPage = (page: number) => {
  stickApi.getPublicStickCommentList({ current: page, pageSize: 10, stickId: stick.value.stickId }).then((res) => {
    comments.value = res.data.list;
    commentCount.value = res.data.total;
    commentCurrent.value = page;
  });
};

const reply = (replyForm: any) => {
  // console.log(replyForm, 'detail');
  const { form, commentId, stickId, receivedAccount, replyAccount } = replyForm;
  const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);

  stickApi
    .submitStickCommentReply({
      ...form,
      commentId,
      stickId,
    })
    .then((res) => {
      if (res.code === 0) {
        Message.success('回复成功');
        comments.value[commentIndex].replys.list.unshift({
          receivedAccount,
          replyAccount,
          ...res.data,
          receivedAccountId: receivedAccount.userId,
          replyAccountId: replyAccount.userId,
        });
      } else {
        Message.error(res.message || '');
      }
    });
};

const changeReplyPage = (info: { current: number; commentId: number }) => {
  const { current, commentId } = info;
  stickApi
    .getStickCommentReply({
      current,
      commentId,
      pageSize: 10,
    })
    .then((res) => {
      if (res.code === 0) {
        const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);

        comments.value[commentIndex].replys.list = res.data.list;
        comments.value[commentIndex].replys.total = res.data.total;
      }
    });
};

onMounted(() => {
  setLoading(true);
  fetchData();
});
</script>

<style scoped>
.stick-detail {
  @apply w-[1200px] mx-auto flex flex-row justify-center mb-[100px] mt-[80px];
}
</style>
