<template>
  <div class="work-detail">
    <a-image-preview v-model:visible="showImgPreview" :src="showImgUrl" />
    <div class="float-right-handle flex flex-col items-center">
      <div class="author relative flex flex-col items-center">
        <router-link :to="{ name: 'UserHome', params: { id: workDetail.author.userId } }">
          <a-avatar :size="50">
            <img :src="workDetail.author.avatar" />
          </a-avatar>
        </router-link>
        <template v-if="isLoginStatus && userInfo.userId !== workDetail.author.userId">
          <template v-if="!workDetail.myFollow">
            <a-button
              size="mini"
              class="absolute bottom-[10px] left-0"
              type="primary"
              @click="followAuthor(workDetail.author.userId, true)"
              >关注</a-button
            >
          </template>
          <template v-else>
            <a-button
              size="mini"
              class="absolute bottom-[10px] left-0"
              @click="followAuthor(workDetail.author.userId, false)"
              >已关注</a-button
            >
          </template>
        </template>
      </div>
      <div class="handles">
        <a-tooltip
          :content="!isLoginStatus || (isLoginStatus && workDetail.myLike !== 1) ? '点赞' : '已点赞'"
          position="right"
        >
          <div
            class="like handle-block relative"
            :class="[isLoginStatus && workDetail.myLike === 1 ? 'text-blue-500' : '']"
            @click="handleLike"
          >
            <icon-heart v-if="!isLoginStatus || (isLoginStatus && workDetail.myLike !== 1)" class="icon" :size="20" />
            <icon-heart-fill v-else class="icon" :size="20" />
            <div class="absolute top-0 right-0">
              <a-badge :count="workDetail.likeCount" :max-count="99" />
            </div>
          </div>
        </a-tooltip>
        <a-tooltip content="评论" position="right">
          <div class="comment handle-block relative" @click="commentDrawerVisible = !commentDrawerVisible">
            <icon-message class="icon" :size="20" />
            <div class="absolute top-0 right-0">
              <a-badge :count="workDetail.commentCount + workDetail.replyCount" :max-count="99" />
            </div>
          </div>
        </a-tooltip>

        <a-trigger
          trigger="click"
          :popup-translate="[0, -10]"
          show-arrow
          position="right"
          scroll-to-close
          unmount-on-close
        >
          <div class="share handle-block">
            <icon-share-alt class="icon" :size="20" />
          </div>
          <template #content>
            <div class="trigger-wrap">
              <div class="trigger-items">
                <!-- <div class="item flex flex-col items-center justify-center w-[70px] text-green-500">
                    <icon-wechat class="icon" :size="30" />
                    <span class="text-gray-600 mt-[5px]">微信</span>
                  </div>
                  <div class="item flex flex-col items-center justify-center w-[70px] text-red-500">
                    <icon-weibo class="icon" :size="30" />
                    <span class="text-gray-600 mt-[5px]">微博</span>
                  </div>
                  <div class="item flex flex-col items-center justify-center w-[70px] text-blue-500">
                    <icon-qq class="icon" :size="30" />
                    <span class="text-gray-600 mt-[5px]">QQ</span>
                  </div> -->
                <div class="item" @click="shareWork('link')">
                  <icon-link class="icon" :size="20" />
                  <span class="text-gray-600 mt-[5px] text-sm">链接分享</span>
                </div>
              </div>
            </div>
          </template>
        </a-trigger>
        <a-tooltip content="举报" position="right">
          <div class="report handle-block" @click="report">
            <icon-question-circle class="icon" :size="20" />
          </div>
        </a-tooltip>
      </div>
    </div>
    <div class="detail-content relative">
      <a-alert v-if="workDetail.isR18 || workDetail.isGrotesque" :banner="true" type="error" :center="true"
        >本作品含有<span class="text-red-500 font-bold mx-[5px]">{{ workDetail.isGrotesque ? 'G向' : 'R18' }}</span
        >内容，请注意浏览环境，保护身心健康</a-alert
      >
      <div class="header">
        <span class="title">{{ workDetail.title }}</span>
        <div class="work-info">
          <div class="work-author">
            <a-avatar :size="30" class="mr-[5px]">
              <img :src="workDetail.author.avatar" />
            </a-avatar>
            <span>{{ workDetail.author.nickname }}</span>
          </div>
          <a-divider direction="vertical" :margin="3" />
          <span class="info-content">{{ formatTime(workDetail.createdAt) }}</span>
          <a-divider direction="vertical" :margin="3" />
          <span class="info-content">{{ workDetail.parentCate.name }}</span
          >/<span class="info-content">{{ workDetail.cate.name }}</span>
          <a-divider direction="vertical" :margin="3" />
          <div class="info-counts info-content">
            <div class="count-wrap"><icon-message class="icon" :size="20" />{{ workDetail.commentCount }}</div>
            <div class="count-wrap"><icon-thumb-up class="icon" :size="20" />{{ workDetail.likeCount }}</div>
            <div class="count-wrap"><icon-eye class="icon" :size="20" />{{ workDetail.viewCount }}</div>
          </div>
          <a-divider direction="vertical" :margin="3" />
          <span class="ml-[10px] cursor-pointer" @click="report">举报</span>
        </div>
      </div>
      <div class="content">
        <div ref="detailRef" class="detail-text" v-html="content"></div>
        <div class="tags">
          <span class="text-sm">标签：</span>
          <span v-for="(tag, index) in workDetail.tagList" :key="index" class="tag">{{ tag }}</span>
        </div>

        <div class="like-btn" @click="handleLike">
          <icon-thumb-up class="icon" :size="28" />
          <span class="count">{{ workDetail.likeCount }}</span>
        </div>
      </div>
      <div class="author-infos">
        <div class="info-card">
          <router-link class="top" :to="{ name: 'UserHome', params: { id: workDetail.author.userId } }">
            <a-avatar :size="60">
              <img :src="workDetail.author.avatar" />
            </a-avatar>
            <div class="info">
              <span class="nickname">{{ workDetail.author.nickname }}</span>
              <span class="desc">{{ workDetail.author.desc || '这个人很懒，什么都没有写' }}</span>
            </div>
          </router-link>
          <div class="bottom">
            <router-link
              :to="{ name: 'UserHome', params: { id: workDetail.author.userId }, query: { type: 'work' } }"
              class="item"
            >
              <span class="label">同人作品</span>
              <span class="value">{{ workDetail.author.workCount }}</span>
            </router-link>
            <router-link
              :to="{ name: 'UserHome', params: { id: workDetail.author.userId }, query: { type: 'fan' } }"
              class="item"
            >
              <span class="label">粉丝</span>
              <span class="value">{{ workDetail.author.fanCount }}</span>
            </router-link>
            <router-link
              :to="{ name: 'UserHome', params: { id: workDetail.author.userId }, query: { type: 'follow' } }"
              class="item"
            >
              <span class="label">关注</span>
              <span class="value">{{ workDetail.author.followCount }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <a-drawer
      width="40%"
      :visible="commentDrawerVisible"
      :hide-cancel="true"
      :footer="false"
      @cancel="commentDrawerVisible = !commentDrawerVisible"
    >
      <template #title> 评论 </template>
      <div class="detail-comments">
        <div class="comment-wrap bg-white mx-auto p-5">
          <span class="font-bold text-xl leading-[30px]">
            评论
            <span class="ml-[5px]">{{ workDetail.commentCount + workDetail.replyCount }}</span>
          </span>
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
                @submit="sendComment"
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
          </div>
          <div ref="commentListRef">
            <template v-if="comments.length !== 0">
              <comment-card
                v-for="comment in comments"
                :key="comment.commentId"
                :list-show="false"
                :comment_id="comment.commentId"
                :avatar="comment.commentAccount.avatar"
                :nickname="comment.commentAccount.nickname"
                :content="comment.content"
                :submit-time="comment.createdAt"
                :comment-id="comment.commentId"
                :replys="comment.replys"
                :reply-current="replyPagination.current"
                @submit-reply="submitReply($event, comment)"
                @reply="replyReply($event, comment)"
                @change-reply-page="changeReplyPage($event, comment.commentId)"
              />
              <a-pagination
                v-if="commentPagination.total > 5"
                class="my-[15px] mx-auto"
                :page-size="commentPagination.pageSize"
                :current="commentPagination.current"
                :total="commentPagination.total"
                show-total
                @change="changeCommentPage"
              />
            </template>
            <template v-else>
              <div class="py-[30px]">
                <a-empty description="当前暂无评论"></a-empty>
              </div>
            </template>
          </div>
        </div>
      </div>
    </a-drawer>
    <div class="detail-comments">
      <div class="comment-wrap bg-white mx-auto p-5 xl:w-[1000px] 2xl:w-[1280px]">
        <span class="font-bold text-xl leading-[30px]">
          评论
          <span class="ml-[5px]">{{ workDetail.commentCount + workDetail.replyCount }}</span>
        </span>
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
              @submit="sendComment"
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
        </div>
        <div ref="commentListRef">
          <template v-if="comments.length !== 0">
            <comment-card
              v-for="comment in comments"
              :key="comment.commentId"
              :list-show="false"
              :comment_id="comment.commentId"
              :avatar="comment.commentAccount.avatar"
              :nickname="comment.commentAccount.nickname"
              :content="comment.content"
              :submit-time="comment.createdAt"
              :comment-id="comment.commentId"
              :replys="comment.replys"
              :comment-current="commentPagination.current"
              :comment-total="commentPagination.total"
              :reply-current="replyPagination.current"
              @submit-reply="submitReply($event, comment)"
              @reply="replyReply($event, comment)"
              @change-reply-page="changeReplyPage($event, comment.commentId)"
            />
            <a-pagination
              v-if="commentPagination.total > 5"
              class="my-[15px] mx-auto"
              :page-size="commentPagination.pageSize"
              :current="commentPagination.current"
              :total="commentPagination.total"
              show-total
              @change="changeCommentPage"
            />
          </template>
          <template v-else>
            <div class="py-[30px]">
              <a-empty description="当前暂无评论"></a-empty>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DOMPurify from 'dompurify';
import { Message } from '@arco-design/web-vue';
import workApi from '@/api/modules/work';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import defaultApi from '@/api/modules/default';
import dayjs from '@/utils/dayjs';

const route = useRoute();

const workDetail = ref<{
  workId: number;
  title: string;
  createdAt: string;
  cate: {
    cateId?: number;
    name: string;
  };
  parentCate: {
    cateId?: number;
    name: string;
  };
  likeCount: number;
  viewCount: number;
  commentCount: number;
  replyCount: number;
  author: {
    nickname: string;
    avatar: string;
    fanCount: number;
    followCount: number;
    workCount: number;
    desc: string;
    userId: number;
  };
  comments: {
    list: [
      {
        commentId: number;
        content: string;
        createdAt: string;
        commentAccount: {
          nickname: string;
          avatar: string;
        };
      },
    ];
    total: number;
  };
  history: [
    {
      content: string;
    },
  ];
  isR18: boolean;
  isGrotesque: boolean;
  tagList: Array<string>;
  myLike?: number;
  myFollow?: number;
}>({
  title: '',
  createdAt: '',
  cate: {
    name: '',
  },
  parentCate: {
    name: '',
  },
  likeCount: 0,
  commentCount: 0,
  viewCount: 0,
  author: {
    userId: 0,
    nickname: '',
    avatar: '',
    fanCount: 0,
    followCount: 0,
    workCount: 0,
    desc: '',
  },
  comments: {
    list: [{ commentId: 0, content: '', createdAt: '', commentAccount: { nickname: '', avatar: '' } }],
    total: 0,
  },
  myLike: 0,
  history: [
    {
      content: '',
    },
  ],
  isR18: false,
  isGrotesque: false,
  tagList: [],
  replyCount: 0,
  workId: 0,
});

const detailRef = ref();
const content = ref('');
const showImgUrl = ref('');
const showImgPreview = ref(false);
const comments = ref<any>([]);
const { userInfo, isLoginStatus } = useUserStore();
const commentEditorRef = ref();
const commentDrawerVisible = ref(false);
const injectReportHandle: any = inject('reportModal');
const { loading, setLoading } = useLoading();
const injectHandle: any = inject('authModal');

const formatTime = (time: string) => {
  return dayjs(new Date(time)).fromNow();
};

const commentForm = ref({
  content: '',
  workId: Number(route.params.id),
});
const renderedContent = (str: string) => {
  return DOMPurify.sanitize(str);
};

const handleLike = () => {
  workApi.likeWork(Number(route.params.id)).then((res) => {
    if (res.code === 0) {
      if (res.data) {
        workDetail.value.likeCount += 1;
        workDetail.value.myLike = 1;
        Message.success('感谢您的鼓励');
      } else {
        workDetail.value.likeCount -= 1;
        workDetail.value.myLike = 0;
        Message.info('已取消喜欢');
      }
    }
  });
};

const followAuthor = async (followId: number, status: boolean) => {
  console.log(status);
  if (isLoginStatus) {
    const action = await defaultApi.follow({
      followId,
      status,
    });
    console.log(action);
    if (action && action.data) {
      if (status) {
        Message.success('关注成功');
        workDetail.value.myFollow = 1;
      } else {
        Message.info('已取消关注');
        workDetail.value.myFollow = 0;
      }
    } else {
      Message.error('关注失败');
    }
  } else {
    injectHandle.openAuthModal('login');
  }
};

const report = () => {
  if (isLoginStatus) {
    injectReportHandle.openReportModal({
      type: 'work',
      workId: workDetail.value.workId,
    });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const commentPagination = reactive({
  ...basePagination,
  pageSize: 5,
});

const replyPagination = reactive({
  ...basePagination,
});

const changeCommentPage = (page: number) => {
  commentPagination.current = page;
  workApi
    .getWorkCommentList({
      ...commentPagination,
      workId: Number(route.params.id),
    })
    .then((res: any) => {
      if (res.code === 0) {
        comments.value = res.data.list;
        commentPagination.total = res.data.total;
      }
    });
};

const fetchCommentReplyData = async (
  params: { current: number; pageSize: number; commentId: number },
  commentIndex: number,
) => {
  try {
    const { data } = await workApi.getReplyList(params);
    comments.value[commentIndex].replys = data;
  } catch (err) {
    console.log(err);
  }
};

const changeReplyPage = (page: number, commentId: number) => {
  replyPagination.current = page;
  const commentIndex = comments.value.findIndex((comment: any) => comment.commentId === commentId);
  fetchCommentReplyData(
    {
      ...replyPagination,
      commentId,
    },
    commentIndex,
  );
};
const setupImgClickListeners = () => {
  const addImgClickListeners = (node) => {
    if (node.tagName === 'IMG') {
      node.addEventListener('click', (event) => {
        const imgSrc = event.target.src;
        showImgUrl.value = imgSrc;
        showImgPreview.value = true;
        // 在这里可以执行你需要的操作，例如打开图片预览等
      });
    } else {
      Array.from(node.childNodes).forEach((childNode) => {
        addImgClickListeners(childNode);
      });
    }
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(node.nodeType, Node.ELEMENT_NODE);
        if (node.nodeType === Node.ELEMENT_NODE) {
          addImgClickListeners(node);
        }
      });
    });
  });

  //   addImgClickListeners(detailRef.value);

  // 开始观察 DOM 变化
  observer.observe(detailRef.value, { childList: true, subtree: true });

  onUnmounted(() => {
    observer.disconnect();
  });
};

const sendComment = () => {
  workApi.sendWorkComment({ ...commentForm.value }).then((res) => {
    if (res.code === 0) {
      Message.success('发布评论成功');
      commentForm.value.content = '';
      const commentItem = {
        ...res.data,
        commentAccount: userInfo,
        replys: {
          list: [],
          total: 0,
        },
      };
      workDetail.value.commentCount += 1;
      comments.value.unshift(commentItem);
      setLoading(false);
      commentEditorRef.value.clear();
    } else {
      Message.error(res.message || '发布评论失败');
    }
  });
};

const shareWork = (type: string) => {
  if (type === 'link') {
    const url = window.location.href;
    // 复制链接
    const save = (e: any) => {
      e.clipboardData.setData('text/plain', url); // 下面会说到clipboardData对象
      e.preventDefault(); // 阻止默认行为
    };
    document.addEventListener('copy', save);
    document.execCommand('copy'); // 使文档处于可编辑状态，否则无效
    Message.success('复制成功');
  }
};

const addReplyInList = (reply: any) => {
  const { commentId } = reply;
  const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);
  if (commentIndex !== -1) {
    comments.value[commentIndex].replys.list.push(reply);
  }
};

const submitReply = (event: any, comment: any) => {
  const replyForm = {
    ...event,
    commentId: comment.commentId,
    workId: workDetail.value.workId,
    receiverId: comment.commentAccountId,
  };
  workApi
    .sendWorkReply({ ...replyForm })
    .then((res) => {
      if (res.code === 0) {
        Message.success('回复成功');
        const replyRes = {
          ...res.data,
          replyAccount: {
            ...userInfo,
          },
          receivedAccount: {
            ...comment.commentAccount,
          },
        };
        addReplyInList(replyRes);
        workDetail.value.commentCount += 1;
      } else {
        Message.error(res.message || '');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const replyReply = (event: any, comment: any) => {
  console.log(comment);
  const replyForm = {
    ...event,
    commentId: comment.commentId,
    workId: workDetail.value.workId,
  };
  workApi
    .sendWorkReply({ ...replyForm })
    .then((res) => {
      if (res.code === 0) {
        Message.success('回复成功');
        const replyRes = {
          ...res.data,
          replyAccount: {
            ...userInfo,
          },
          receivedAccount: {
            ...comment.commentAccount,
          },
        };
        addReplyInList(replyRes);
        workDetail.value.commentCount += 1;
      } else {
        Message.error(res.message || '');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(() => {
  const { id } = route.params as any;
  workApi.getWorkDetail(id).then((res: any) => {
    workDetail.value = res.data;
    content.value = renderedContent(res.data.history[0].content);
    setupImgClickListeners();
    comments.value = workDetail.value.comments.list;
    // 初始化评论分页
    commentPagination.total = res.data.comments.total;
    document.title = `${res.data.title} - 轩辕天书社区`;
  });
});
</script>

<style lang="scss" scoped>
.work-detail {
  //   @apply bg-white mt-[60px] w-full border-t border-t-gray-100 overflow-hidden;

  .detail-content {
    .tags {
      @apply my-[20px] font-bold;
      .tag {
        @apply px-[20px] font-normal py-[10px] bg-gray-200 text-sm rounded-full hover:bg-gray-300 mr-[10px] cursor-pointer break-words;
      }
    }
    // @apply
    @apply bg-white mt-[60px] w-full border-t border-t-gray-100 overflow-hidden;

    .header {
      @apply border-b border-b-gray-100 lg:w-[1200px] 2xl:w-[1480px] mx-auto mt-[40px];

      .title {
        @apply my-[10px] block text-3xl font-bold text-center;
      }

      .work-info {
        @apply flex flex-row justify-center items-center h-[60px] leading-[60px] text-gray-500 text-base;

        .work-author {
          @apply flex flex-row justify-start items-center h-[60px] leading-[60px] mr-[10px];
        }

        .info-content {
          @apply mx-[10px];
        }

        .info-counts {
          @apply flex flex-row justify-start items-center h-[60px] leading-[60px] mr-[10px];

          .count-wrap {
            @apply mx-[5px] flex flex-row justify-start items-center;

            .icon {
              @apply mr-[5px];
            }
          }
        }
      }
    }

    .content {
      @apply border-b border-b-gray-100 lg:w-[1200px] 2xl:w-[1480px] mx-auto py-[30px] text-base overflow-scroll;
    }

    .author-infos {
      @apply my-[20px] lg:w-[1200px] 2xl:w-[1480px] mx-auto;

      .info-card {
        @apply flex flex-row items-center justify-between;
        .top {
          @apply flex flex-row items-center;
          .info {
            @apply flex flex-col justify-center items-start ml-[10px];

            .nickname {
              @apply text-base;
            }
            .desc {
              @apply text-sm text-gray-500 mt-[3px];
            }
          }
        }
        .bottom {
          @apply flex flex-row justify-start items-center mt-[10px];
          .item {
            @apply flex flex-col justify-center items-center mx-[10px];
            .label {
              @apply text-sm text-gray-500;
            }
            .value {
              @apply text-xl my-[10px] font-bold;
            }
          }
        }
      }
    }

    :deep(.detail-text) {
      p {
        @apply mb-[10px];
      }

      img {
        @apply lg:w-[1200px] 2xl:w-[1480px];
      }
    }

    .like-btn {
      @apply w-[160px] h-[70px] text-center cursor-pointer bg-blue-500 text-white rounded-full flex flex-col justify-center items-center mx-auto my-[30px];

      //   .icon {
      //     @apply mb-[5px];
      //   }

      //   .count {
      //     @apply mt-[5px];
      //   }
    }
  }
  .detail-comments {
    @apply mt-[10px] bg-white;
  }
}

.float-right-handle {
  @apply fixed left-[50px] 2xl:left-[100px] top-[300px] w-[60px] h-[300px]  z-[999];

  .handles {
    .handle-block {
      @apply w-[50px] h-[50px] flex flex-col justify-center items-center cursor-pointer rounded-full bg-gray-200 my-[20px];
    }
  }
}

.trigger-wrap {
  @apply bg-white h-[80px] shadow-lg border border-gray-50 rounded-md px-[10px];
  .trigger-items {
    @apply flex flex-row justify-between items-center h-[80px];
    .item {
      @apply flex flex-col items-center justify-center w-[70px] cursor-pointer;
    }
  }
}
</style>
