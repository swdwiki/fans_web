<template>
  <div class="post_detail_wrap mx-auto flex flex-row justify-center items-start mb-10">
    <template v-if="showDetail">
      <a-drawer v-model:visible="commentDrawer" :width="400" :footer="false" mask-closable closable unmount-on-close>
        <template #title>
          评论 <span class="ml-[5px]">{{ postCounts.commentCount }}</span>
        </template>
        <div class="relative">
          <div class="relative comment-input my-[15px] flex flex-row flex-nowrap justify-start items-start">
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
          <div>
            <template v-if="comments.length !== 0">
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
                :reply-current="replyPagination.current"
                :list-show="false"
                @send-comment-report="sendCommentReport"
                @submit-reply="submitReply($event, comment)"
                @reply="replyReply($event, comment)"
                @change-reply-page="changeReplyPage($event, comment.commentId)"
              />
            </template>
            <template v-else>
              <div class="py-[30px]">
                <a-empty description="当前暂无评论"></a-empty>
              </div>
            </template>
          </div>
        </div>
      </a-drawer>
      <post-action-board
        v-loading="loading"
        class="w-[1200px]"
        :avatar="postDetail.author.avatar"
        :show-follow-btn="followStatus || postDetail.author.userId === userInfo.userId"
        :show-like-status="likeStatus"
        :post-id="postDetail.postId"
        :comment-count="postCounts.commentCount"
        :like-count="postCounts.likeCount"
        @follow-action="follow($event)"
        @like-action="like"
        @comment-action="openCommentDrawer"
      />
      <div class="flex flex-col">
        <div ref="test" class="post_detail bg-white w-[820px] px-5 pb-10 mr-[10px]">
          <div class="header">
            <h1 class="text-3xl font-bold pt-3">{{ postDetail.title }}</h1>
            <div class="text-sm flex flex-row justify-start items-center">
              <span class="leading-5 mr-3">{{ postDetail.author.nickname }}</span>
              <span class="text-gray-400 mr-3">{{ dayjs(postDetail.createdAt).format('YYYY-MM-DD') }}</span>
              <span class="text-gray-400 mr-3">{{ postDetail.subject.title }}-{{ postDetail.plates[0].name }}</span>
              <span class="text-gray-400 mr-3">{{ postDetail.viewCount }}</span>
            </div>
          </div>
          <div ref="contentRef" class="detail py-5">
            <template v-if="postDetail.history[0].editorType === 'markdown'">
              <MdPreview
                editor-id="preview-only"
                :model-value="postDetail.history[0].content"
                :preview-theme="postDetail.history[0].markdownConfig.theme"
              />
            </template>
            <template v-else-if="postDetail.history[0].editorType === 'rich'">
              <div class="leading-[36px] text-[15px]" v-html="postDetail.history[0].content"></div>
            </template>
          </div>
          <div v-if="postDetail.tags && postDetail.tags.length !== 0" class="tags px-5">
            <span>标签：</span>
            <a-tag v-for="(tag, index) in postDetail.tags" :key="index" size="large" class="mx-2">{{ tag.name }}</a-tag>
          </div>
        </div>
        <div class="bg-white my-10 p-5 w-[820px]">
          <span class="font-bold text-xl leading-[30px]">
            评论 <span class="ml-[5px]">{{ postCounts.commentCount }}</span>
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
                @send-comment-report="sendCommentReport"
                @submit-reply="submitReply($event, comment)"
                @reply="replyReply($event, comment)"
                @change-reply-page="changeReplyPage($event, comment.commentId)"
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
      <div class="post_info w-[300px] flex flex-col sticky top-[80px] ml-[10px]">
        <div class="author_card bg-white mb-5 p-5">
          <div
            class="profile flex flex-row justify-start items-center h-[60px] cursor-pointer"
            @click="gotoPage({ routerPath: `/u/${postDetail.author.userId}` })"
          >
            <a-avatar :size="50">
              <img :src="postDetail.author.avatar" />
            </a-avatar>
            <div class="flex flex-col justify-between items-start ml-2">
              <span class="font-bold text-base h-[25px] leading-[25px]">{{ postDetail.author.nickname }}</span>
              <span class="text-gray-400 text-xs h-[25px] leading-[25px]">{{
                postDetail.author.desc || postDetail.author?.short || '他好像什么都没有写'
              }}</span>
            </div>
          </div>
          <div class="amount_list flex flex-row flex-nowrap justify-around items-center px-5 my-2">
            <router-link
              :to="{ name: 'UserHome', params: { id: postDetail.author.userId }, query: { type: 'post' } }"
              class="flex flex-col justify-center items-center"
            >
              <span class="text-base text-black my-1 font-bold">{{ authorCounts.postCount }}</span>
              <span class="text-sm text-gray-400 my-1 font-bold">帖子</span>
            </router-link>
            <div class="flex flex-col justify-center items-center">
              <span class="text-base text-black my-1 font-bold">{{
                authorCounts.readCount > 1000
                  ? Number(Number(authorCounts.readCount) / 1000).toFixed(1) + 'K'
                  : authorCounts.readCount
              }}</span>
              <span class="text-sm text-gray-400 my-1 font-bold">阅读数</span>
            </div>
            <div class="flex flex-col justify-center items-center">
              <span class="text-base text-black my-1 font-bold">{{ authorCounts.followerCount }}</span>
              <span class="text-sm text-gray-400 my-1 font-bold">关注者</span>
            </div>
          </div>
          <div v-if="userInfo.userId !== postDetail.author.userId" class="card_handle">
            <a-button v-if="!followStatus" class="w-full" size="large" type="primary" @click="follow(true)"
              >关注</a-button
            >
            <a-popconfirm v-else content="确定取消关注么？" @ok="follow(false)">
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
        <div v-if="postDetail.columns && postDetail.columns.length !== 0" class="column_card bg-white px-5 py-3 mb-5">
          <span class="text-sm font-bold leading-[20px] h-[20px] block">收录于以下专栏</span>
          <a-divider :margin="10" />
          <router-link
            :to="`/column/${postDetail.columns[0].columnId}`"
            class="flex flex-row justify-start items-center"
          >
            <img
              :src="
                postDetail.columns[0].cover ||
                'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp'
              "
              class="w-[80px] h-[60px] object-cover"
            />
            <div class="column_info flex flex-col ml-3 justify-center items-start">
              <span class="font-bold text-sm line-clamp-1 my-1">{{ postDetail.columns[0].name }}</span>
              <span class="text-xs text-gray-400 line-clamp-1 my-1">{{ postDetail.columns[0].desc }}</span>
              <span class="text-xs text-gray-400"
                ><span class="mr-1">{{ postDetail.columns[0].postCount }}</span
                >篇帖子</span
              >
            </div>
          </router-link>
        </div>
        <div class="">
          <a-collapse :default-active-key="[1]" :bordered="false" expand-icon-position="right">
            <template #expand-icon="{ active }">
              <template v-if="active">
                <span class="text-gray-400 mr-1 text-sm">收起<icon-double-down /></span>
              </template>
              <template v-else>
                <span class="text-gray-400 mr-1 text-sm">展开<icon-double-right /></span>
              </template>
            </template>
            <a-collapse-item :key="1" :style="customStyle">
              <template #header>
                <div class="catalog-title h-[40px] flex flex-row justify-between items-center">
                  <span class="text-base font-bold px-5">目录</span>
                </div>
              </template>
              <div class="">
                <template v-if="postDetail.history[0].editorType === 'markdown'">
                  <MdCatalog editor-id="preview-only" :scroll-element="scrollElement" class="text-sm" />
                </template>
              </div>
            </a-collapse-item>
          </a-collapse>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="bg-white w-[1200px] h-[80vh] flex flex-col justify-center items-center">
        <img :src="getAssetsFile('404.svg', 'svg')" class="w-[500px] h-[500px]" />
        <span class="text-xl text-gray-400">非常抱歉，{{ errorContent }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import useScroll from '@/hooks/scroll';
import postApi, { Post } from '@/api/modules/post';
import defaultApi, { CommentItemDto } from '@/api/modules/default';
import 'md-editor-v3/lib/style.css';
import useLoading from '@/hooks/loading';
import { useUserStore } from '@/store';
import { Pagination } from '@/utils/global';
import { getAssetsFile } from '@/utils/format';
import dayjs from '@/utils/dayjs';

const injectHandle: any = inject('authModal');
const commentListRef = ref<any>();

const route = useRoute();
const router = useRouter();

const scrollElement = document.documentElement;
const showDetail = ref(true);
const errorContent = ref('帖子走丢了');

const { userInfo, isLoginStatus } = useUserStore();
const { loading, setLoading } = useLoading();

const { isBottom } = useScroll(commentListRef.value);

const commentEditorRef = ref<any>(null);

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const customStyle = {
  backgroundColor: '#fff',
};

const commentDrawer = ref(false);
const postCounts = ref({
  likeCount: 0,
  commentCount: 0,
});

const postDetail = ref<Post>({
  postId: 0,
  title: '',
  plateId: 0,
  subjectId: 0,
  history: [
    {
      content: '',
      markdownConfig: {
        theme: '',
      },
      editorType: 'markdown',
    },
  ],
  subject: {
    subjectId: '',
    title: '',
    desc: '',
    cover: '',
    plates: [],
  },
  plates: [
    {
      plateId: 0,
      name: '',
    },
  ],
  myLike: 0,
  authorId: 0,
  author: {
    nickname: '',
    avatar: '',
    userId: 0,
    myFollow: 0,
  },
  createdAt: '',
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  top: false,
  subjectTop: false,
  plateTop: false,
});

const comments = ref<Array<CommentItemDto>>([]);

const nofollow = ref(false);

const followStatus = ref(false);
const likeStatus = ref(false);

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const commentPagination = reactive({
  ...basePagination,
});

const replyPagination = reactive({
  ...basePagination,
});

const authorCounts = ref({
  followerCount: 0,
  readCount: 0,
  postCount: 0,
  followCount: 0,
});
const commentForm = ref<{ postId: number; imgList: Array<string>; content: string }>({
  postId: 0,
  content: '',
  imgList: [],
});

const openCommentDrawer = () => {
  commentDrawer.value = true;
};

const contentRef = ref();

const replaceImgTag = (content: string) => {
  // 1. 获取HTML内容

  // 2. 使用正则表达式提取img标签中的src路径
  const imgSrcRegex = /<img[^>]*src="([^"]*)"/g;
  const matches = content.match(imgSrcRegex);
  const aImageNodes: any = [];

  if (matches) {
    matches.forEach((match, index) => {
      const srcPath = match.replace(/<img[^>]*src="|"/g, ''); // 提取src路径
      const aImageNode = document.createElement('a-image');
      aImageNode.setAttribute('src', srcPath);
      aImageNodes.push(aImageNode);
    });

    // 3. 将img标签替换为a-image标签
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const imgNodes = tempDiv.getElementsByTagName('img');
    Array.from(imgNodes).forEach((imgNode: any, index) => {
      const aImageNode = aImageNodes[index];
      imgNode.parentNode.replaceChild(aImageNode, imgNode);
    });
  } else {
    console.log('No img tags found in the HTML content.');
  }
};

const gotoPage = (routeInfo: { routerPath: string; routeName?: string }) => {
  if (routeInfo.routerPath) {
    router.push({
      path: routeInfo.routerPath,
    });
  } else {
    router.push({
      name: routeInfo.routeName,
    });
  }
};

const follow = (status: boolean) => {
  if (isLoginStatus) {
    defaultApi
      .follow({ followId: postDetail.value.author.userId, status })
      .then((res) => {
        if (res.code === 0) {
          if (res.data) {
            if (status) {
              Message.success('已关注');
              followStatus.value = true;
            } else {
              Message.success('已取消关注');
              followStatus.value = false;
            }
          } else {
            Message.error(res.message || '');
          }
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

const like = () => {
  if (isLoginStatus) {
    postApi
      .sendLikeStatus({ postId: postDetail.value.postId })
      .then((res) => {
        if (res.code === 0) {
          if (res.data.status) {
            Message.success('已点赞');
            likeStatus.value = true;
            postCounts.value.likeCount += 1;
          } else {
            Message.success('已取消点赞');
            likeStatus.value = false;
            postCounts.value.likeCount -= 1;
          }
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

const addReplyInList = (reply: any) => {
  const { commentId } = reply;
  const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);
  if (commentIndex !== -1) {
    comments.value[commentIndex].replys.list.push(reply);
  }
};

const fetchCommentReplyData = async (
  params: { current: number; pageSize: number; commentId: number },
  commentIndex: number,
) => {
  try {
    const { data } = await postApi.getReplyList(params);
    comments.value[commentIndex].replys = data;
  } catch (err) {
    console.log(err);
  }
};

const changeReplyPage = (page: number, commentId: number) => {
  replyPagination.current = page;
  const commentIndex = comments.value.findIndex((comment) => comment.commentId === commentId);
  fetchCommentReplyData(
    {
      ...replyPagination,
      commentId,
    },
    commentIndex,
  );
};

const submitReply = (event: any, comment: CommentItemDto) => {
  const replyForm = {
    ...event,
    commentId: comment.commentId,
    postId: postDetail.value.postId,
    receiverId: comment.commentAccountId,
  };
  postApi
    .sendPostReply({ ...replyForm })
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
        postCounts.value.commentCount += 1;
      } else {
        Message.error(res.message || '');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const replyReply = (event: any, comment: CommentItemDto) => {
  console.log(comment);
  const replyForm = {
    ...event,
    commentId: comment.commentId,
    postId: postDetail.value.postId,
  };
  postApi
    .sendPostReply({ ...replyForm })
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
        postCounts.value.commentCount += 1;
      } else {
        Message.error(res.message || '');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendCommentReport = (reportForm: any) => {
  console.log(reportForm);
};

const sendComment = () => {
  postApi.sendPostComment({ ...commentForm.value }).then((res) => {
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
      postCounts.value.commentCount += 1;
      comments.value.unshift(commentItem);
      setLoading(false);
      commentEditorRef.value.clear();
    } else {
      Message.error(res.message || '发布评论失败');
    }
  });
};

const getPostDetail = (postId: number) => {
  setLoading(true);
  postApi
    .PostDetail({ postId })
    .then((res) => {
      if (res.code === 0) {
        postDetail.value = { ...res.data.post };
        comments.value = res.data.comments.list;
        commentPagination.total = res.data.comments.total;
        authorCounts.value = res.data.authorCounts;
        postCounts.value = res.data.postCounts;
        // nextTick(() => {
        //   console.log(contentRef.value.querySelectorAll('h1,h2,h3'));
        // });

        followStatus.value = postDetail.value.author.myFollow > 0;
        likeStatus.value = postDetail.value.myLike > 0;
        setLoading(false);
        showDetail.value = true;
      } else {
        Message.error('获取文章详情失败');
      }
    })
    .catch((err) => {
      if (err && err.status !== 200) {
        showDetail.value = false;
      } else {
        console.log(err);
      }
      errorContent.value = err.data.message;
    });
};

const fetchPostCommentData = (params: { current: number; postId: number; pageSize: number }) => {
  postApi
    .getPostComment({ ...params })
    .then((res) => {
      if (res.code === 0) {
        const { list, total } = res.data;
        comments.value.push(...list);
        commentPagination.total = total;
      } else {
        Message.error('获取文章评论失败');
      }
    })
    .then((err) => {
      console.log(err);
    });
};

onMounted(() => {
  const { postId } = route.params;
  if (Number.isNaN(Number(postId))) {
    router.replace({ name: 'home' });
  } else {
    getPostDetail(Number(postId));
    commentForm.value.postId = Number(postId) as number;
  }
});

watch(isBottom, (newIsBottom) => {
  console.log('sdasdas');
  // newIsBottom如果true
  if (newIsBottom) {
    // 书写触底刷新代码, 记得刷新重置isBottom为false
    if (commentPagination.total > comments.value.length) {
      commentPagination.current += 1;
      fetchPostCommentData({
        ...commentPagination,
        postId: postDetail.value.postId,
      });
      isBottom.value = false;
    }
  }
});
</script>

<style lang="scss" scoped>
.post_detail_wrap {
  @apply mt-[80px];
}
.rich-input:empty:before {
  content: attr(placeholder);
  @apply text-gray-400;
}

.comment {
  transition: all 0.3s;
  background: var(--u-bg-color-secondary);
  border: 1px solid var(--u-bg-color-overlay);
  border-radius: 4px;
  font-size: 14px;

  .rich-input {
    display: inline-block;
    width: 100%;
    box-sizing: border-box;
    resize: both;
    background-position: 120% -10px;
    transition: all 0.3s;
    .mentionUser {
      background-color: red;
    }
  }

  .rich-input:empty::before {
    cursor: text;
    content: attr(placeholder);
    @apply text-gray-400;
  }
  .image-preview-box {
    display: flex;
    padding: 0 12px;
    .image-preview {
      position: relative;
      img {
        height: 64px;
        min-width: 64px;
      }
      .clean-btn {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        svg {
          display: block;
        }
      }
      .clean-btn:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
