<template>
  <div class="stick-card rounded-md bg-white mb-[10px] block">
    <div class="p-5">
      <div class="header-info flex flex-row justify-between items-center">
        <div class="left flex flex-row justify-start items-center h-[55px] py-[2.5px]">
          <!-- 弹窗卡片 -->
          <router-link :to="{ name: 'UserHome', params: { id: stick.author.userId } }">
            <a-avatar :size="50">
              <img :src="stick.author.avatar" />
            </a-avatar>
          </router-link>

          <!-- <a-trigger
            position="top"
            :popup-translate="[0, -10]"
            :show-arrow="true"
            :arrow-class="['border border-gray-200 shadow-black shadow-2xl']"
          >
            <a-avatar :size="50">
              <img :src="stick.author.avatar" />
            </a-avatar>
            <template #content>
              <div
                class="userinfo bg-white w-[280px] border border-gray-100 p-[15px] shadow-gray-400 shadow-2xl rounded-md"
              >
                <div class="">
                  <router-link
                    :to="{ name: 'UserHome', params: { id: stick.author.userId } }"
                    class="flex flex-row my-[15px]"
                  >
                    <a-avatar :size="50">
                      <img class="object-cover" :src="stick.author.avatar" />
                    </a-avatar>
                    <div class="content flex flex-col ml-[5px]">
                      <span class="font-bold text-[16px] leading-6">{{ stick.author.nickname }}</span>
                      <span class="text-xs text-gray-400 leading-6">{{
                        stick.author.short || '这个人很懒什么都没有写'
                      }}</span>
                    </div>
                  </router-link>
                  <div class="action mx-auto mt-[15px]">
                    <a-popconfirm
                      v-if="followStatus"
                      content="是否取消关注？"
                      @ok="followAction(stick.author.userId, false)"
                    >
                      <a-button long type="outline">已关注</a-button>
                    </a-popconfirm>
                    <a-button v-else long type="primary" @click="followAction(stick.author.userId, false)"
                      >关注</a-button
                    >
                  </div>
                </div>
                <a-divider :margin="15" />
                <div class="flex flex-row justify-around items-center mb-[5px]">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-black text-[16px]">{{ stick.author.followCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">关注</span>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-black text-[16px]">{{ stick.author.fanCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">粉丝</span>
                  </div>
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-black text-[16px]">{{ stick.author.stickCount }}</span>
                    <span class="text-sm text-gray-500 font-bold mt-[10px]">尺牍</span>
                  </div>
                </div>
              </div>
            </template>
          </a-trigger> -->
          <div class="ml-[10px] h-full flex flex-col justify-center items-start">
            <router-link :to="{ name: 'UserHome', params: { id: stick.author.userId } }">
              <span class="font-bold text-[16px] leading-6">{{ author.nickname }}</span>
            </router-link>
            <div class="text-gray-400 leading-6">
              <router-link :to="`/sticks/${stick.stickId}`">{{ formatTimeFromNow(stick.createdAt) }}</router-link>
            </div>
          </div>
        </div>
        <template v-if="showFollowBtn && isLoginStatus">
          <div class="right text-gray-400 flex flex-row justify-end items-center">
            <a-button v-if="stick.myFollow === 0" class="mr-5" type="outline" @click="follow(stick.author.userId)"
              >关注</a-button
            >
            <more-btn type="stick" @report="report(stick.stickId)"></more-btn>
          </div>
        </template>
      </div>
      <div class="stick-content mt-[5px] ml-[60px]">
        <span class="leading-[26px] text-black" v-html="content"></span>
        <div class="mt-[10px]">
          <more-images v-if="imgs && imgs.length !== 0" :author="author.nickname" :images="imgs"></more-images>
        </div>
        <div class="flex flex-row justify-between items-center" :draggable="false">
          <div class="min-w-[1px]">
            <span
              v-if="stick.theme && stick.theme.name"
              class="bg-blue-100 font-bold py-[5px] px-[10px] text-xs rounded-xl text-blue-500"
              >{{ stick.theme.name }}
              <icon-right v-if="stick.theme && stick.theme.themeId" :size="12" />
            </span>
          </div>
          <div v-if="stick.likeCount && stick.likeCount !== 0 && stick.likes && stick.likes.length !== 0">
            <a-avatar-group>
              <a-avatar v-for="like in stick.likes" :key="like.recordId" :size="24">
                <img :draggable="false" :src="`${like.likeUser.avatar}?w=20&h=20`" />
              </a-avatar>
            </a-avatar-group>
            <span class="ml-[5px] text-sm text-gray-500">等人点赞过</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="border-y border-y-gray-100 bg-white h-[50px] flex flex-row flex-nowrap justify-between items-center w-full"
    >
      <a-trigger trigger="click" show-arrow :popup-translate="[0, 10]" position="bottom">
        <div
          class="w-1/3 block text-center flex flex-row justify-center items-center text-gray-500 text-stroke-emerald-50 cursor-pointer"
        >
          <icon-share-alt class="mr-[5px]" :size="16" />
          <span>分享</span>
        </div>
        <template #content>
          <div
            class="bg-white w-[120px] h-[40px] leading-[40px] text-center border-gray-200 border flex flex-row items-center justify-center"
            @click="copyLink(stick.stickId)"
          >
            <IconLink size="16" class="font-bold mr-[5px] text-blue-500" />
            <span>复制链接</span>
          </div>
        </template>
      </a-trigger>
      <template v-if="!showCommentList">
        <div
          class="w-1/3 text-center flex flex-row justify-center items-center text-stroke-emerald-50 cursor-pointer"
          :class="[actionBox ? 'text-blue-500' : 'text-gray-500']"
          @click="showActionBox"
        >
          <icon-message class="mr-[5px]" :size="16" />
          <span>{{ commentCount + replyCount > 0 ? commentCount + replyCount : '评论' }}</span>
        </div>
      </template>
      <template v-else>
        <div
          class="w-1/3 block text-center flex flex-row justify-center items-center text-stroke-emerald-50 cursor-pointer text-blue-500"
        >
          <icon-message class="mr-[5px]" :size="16" />
          <span>{{ commentCount + replyCount > 0 ? commentCount + replyCount : '评论' }}</span>
        </div>
      </template>
      <div
        class="w-1/3 block text-center flex flex-row justify-center items-center cursor-pointer"
        :class="[myLikeStick ? 'text-blue-500' : 'text-gray-500']"
        @click="setMyLikeStick(stick.stickId)"
      >
        <icon-thumb-up class="mr-[5px]" :size="16" :class="[showTransition ? 'animate-bounce' : '']" />
        <span>{{ likeCount > 0 ? likeCount : '点赞' }}</span>
      </div>
    </div>
    <div v-if="actionBox" class="w-full bg-white transition-all duration-75 p-5">
      <div class="head">
        <span class="text-base font-bold">评论</span>
      </div>
      <div class="comment-input my-[15px] flex flex-row flex-nowrap justify-start items-start">
        <div class="w-[60px]">
          <a-avatar :size="45">
            <template v-if="isLoginStatus">
              <img :src="userInfo.avatar" />
            </template>
            <template v-else>
              <IconUser :size="20" />
            </template>
          </a-avatar>
        </div>
        <div class="w-full">
          <input-editor
            ref="commentEditorRef"
            v-model="commentForm.content"
            placeholder="请输入评论"
            :max-stick-text-count="300"
            btn-text="评论"
            :show-input-editor="isLoginStatus"
            @submit="submitComment"
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
      <div class="comment-list mt-[10px]">
        <template v-if="commentTotal !== 0">
          <comment-card
            v-for="comment in comments"
            :key="comment.commentId"
            :comment_id="comment.commentId"
            :avatar="comment.commentAccount.avatar"
            :nickname="comment.commentAccount.nickname"
            :content="comment.content"
            :submit-time="comment.createdAt"
            :comment-id="comment.commentId"
            :replys="comment.replys"
            :loading="loading"
            :list-show="listShow"
            @submit-reply="submitReply($event, comment)"
            @reply="replyReply($event, comment)"
            @change-reply-page="changeReplyPage($event, comment.commentId)"
            @reply-router-url="replyRouterUrl"
          />
          <router-link
            v-if="commentTotal > 5 && listShow"
            :to="{ name: 'stickDetail', params: { id: stick.stickId } }"
            class="block w-full mx-auto bg-gray-100 h-[30px] leading-[30px] text-center hover:bg-gray-200 hover:bg-gray-200 ease-in duration-300 text-xs"
          >
            点击查看更多评论
          </router-link>
          <div v-else-if="commentTotal > 10 && !listShow" class="flex flex-row justify-end items-center">
            <a-pagination :total="commentTotal" :current="commentCurrent" show-total @change="changePage">
              <template #total="{ total }">
                <span class="text-gray-500">共{{ total }}条评论</span>
              </template>
            </a-pagination>
          </div>
        </template>
        <template v-else>
          <div class="py-[30px]">
            <a-empty description="当前暂无评论"></a-empty>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import defaultApi, { CommentDto, CommentInfoDto, CommentItemDto, Images, StickCommentDto } from '@/api/modules/default';
import stickApi from '@/api/modules/stick';
import { formatTimeFromNow } from '@/utils/format';
import { useUserStore } from '@/store';

const route = useRoute();
const router = useRouter();

const { userInfo, isLoginStatus } = useUserStore();

const props = defineProps({
  showMoreIcon: {
    type: Boolean,
    default: true,
  },
  showCommentList: {
    type: Boolean,
    default: false,
  },
  showFollowBtn: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
  listShow: {
    type: Boolean,
    default: false,
  },
  stick: {
    type: Object,
    default: () => {
      return {};
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  imgs: {
    type: Array<Images>,
    default: () => {
      return [];
    },
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: Object,
    default: () => {
      return {};
    },
  },
  club: {
    type: Object,
    default: () => {
      return {};
    },
  },
  comments: {
    type: Array<CommentInfoDto>,
    default: () => {
      return [];
    },
  },
  commentTotal: {
    type: Number,
    default: 0,
  },
  commentCurrent: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits<{
  (e: 'update:comments', data: Array<CommentInfoDto>): void;
  (e: 'actionMoreComments', id: number): void;
  (e: 'submitComment', commentForm: any): void;
  (e: 'follow', id: number): void;
  (e: 'changeCommentPage', page: number): void;
  (e: 'reply', data: any): void;
  (e: 'submitReply', data: any): void;
  (e: 'changeReplyPage', info: { current: number; commentId: number }): void;
}>();

const commentsList = ref(props.comments);

const showTransition = ref(false);
const myLikeStick = ref<boolean>(props.stick.myLikeStick > 0);
const likeCount = ref<number>(props.likeCount || props.stick.likeCount);
const commentCount = ref<number>(props.stick.commentCount);
const replyCount = ref<number>(props.stick.replyCount);
const commentEditorRef = ref<any>();

// watch(commentsList.value, (newValue) => {
// });

const commentForm = reactive({
  content: '',
  imgList: [],
});

const changePage = (page: number) => {
  emit('changeCommentPage', page);
};
const injectHandle: any = inject('authModal');
const injectReportHandle: any = inject('reportModal');
const followStatus = ref(!!(props.stick.author.myFollow && props.stick.author.myFollow > 0));

const submitComment = () => {
  emit('submitComment', commentForm);

  commentEditorRef.value.clear();
};

const commentCountAdd = () => {
  commentCount.value += 1;
};

const commentUpdate = (list: any) => {
  // if(!commentsList.value){

  // }
  commentsList.value.unshift(...list);
};

const replyUpdate = (index: number, reply: any) => {
  commentsList.value[index].replys.list.unshift(reply);
};

const report = (stickId: number) => {
  if (isLoginStatus) {
    injectReportHandle.openReportModal({
      type: 'stick',
      stickId,
    });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const submitReply = (replyForm: any, comment: any) => {
  const { commentId, commentAccount } = comment;
  emit('submitReply', {
    commentId,
    replyForm,
    receiverId: commentAccount.userId,
    stickId: props.stick.stickId,
    commentAccount,
  });
};

const replyReply = (replyForm: any, comment: any) => {
  const { commentId } = comment;
  const { replyInfo, ...form } = replyForm;
  emit('reply', {
    form,
    commentId,
    receivedAccount: replyInfo.receivedAccount,
    replyAccount: userInfo,
    stickId: props.stick.stickId,
  });
};

const actionBox = ref(props.showCommentList);

const showActionBox = () => {
  actionBox.value = !actionBox.value;
  // const data = emit('actionMoreComments', props.stick.stickId);
};

const copyLink = (stickId: number) => {
  const url = `${window.location.origin}/sticks/${stickId}`;
  const save = (e: any) => {
    e.clipboardData.setData('text/plain', url); // 下面会说到clipboardData对象
    e.preventDefault(); // 阻止默认行为
  };
  document.addEventListener('copy', save);
  document.execCommand('copy'); // 使文档处于可编辑状态，否则无效
  Message.success('复制成功');
};

const setMyLikeStick = (stickId: number) => {
  if (isLoginStatus) {
    showTransition.value = true;
    stickApi
      .setMyLikeStick({ stickId })
      .then((res: any) => {
        if (res.code === 0) {
          setTimeout(() => {
            if (res.data.status) {
              myLikeStick.value = true;
              likeCount.value += 1;
            } else {
              myLikeStick.value = false;
              likeCount.value -= 1;
            }
            showTransition.value = false;
          }, 1000);
        }
      })
      .catch((err) => {
        showTransition.value = false;
      });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const follow = (userId: number) => {
  emit('follow', userId);
};

const replyRouterUrl = () => {
  const router = useRouter();
  router.push({
    name: 'stickDetail',
    params: {
      id: props.stick.stickId,
    },
  });
};

const changeReplyPage = (current: number, commentId: number) => {
  emit('changeReplyPage', { current, commentId });
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

watchEffect(() => {
  emit('update:comments', commentsList.value);
});
defineExpose({
  commentCountAdd,
  commentUpdate,
  replyUpdate,
});
</script>

<style lang="scss" scoped>
.stick-card {
}
</style>
