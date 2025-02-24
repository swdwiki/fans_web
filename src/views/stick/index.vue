<template>
  <div class="stick-container relative mx-auto relatice">
    <div class="stick_clubs bg-white w-[180px] py-[10px] sticky top-[80px] left-0 h-[640px] overflow-scroll">
      <div class="w-[165px] mx-auto">
        <span
          class="rounded-md block text-black font-bold text-[14px] h-[50px] leading-[50px] px-[10px] hover:(text-blue-600 bg-gray-100) my-[5px]"
          :class="[selectClubsIndex === 0 && selectThemeIndex === 0 ? 'bg-gray-100 text-blue-600' : '']"
          @click="selectDefault"
          >最新尺牍</span
        >
        <div v-for="club in clubList" :key="club.clubId" class="leading-[50px]">
          <span
            :class="[selectClubsIndex === club.clubId ? 'text-blue-600' : '']"
            class="rounded-md block font-bold text-black text-[14px] h-[50px] leading-[50px] px-[10px] hover:(text-blue-600 bg-gray-100) my-[5px]"
            @click="selectClubIndex(club.clubId)"
            >{{ club.name }}</span
          >
          <div v-if="showThemeByClubIndex === club.clubId" class="themes">
            <span
              v-for="theme in club.themes"
              :key="theme.themeId"
              :class="[selectThemeIndex === theme.themeId ? 'bg-gray-100 text-blue-600' : 'text-gray-400']"
              class="rounded-md font-bold block text-[12px] h-[50px] leading-[50px] px-[10px] hover:(text-blue-600 bg-gray-100) my-[5px]"
              @click="selectTheme(theme.themeId, club.clubId)"
              >{{ theme.name }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div ref="stickListRef" class="stick-list top-[80px] left-[200px]">
      <stick-editor
        ref="stickEditorRef"
        v-model="stickSubmitForm.content"
        :img-list="stickSubmitForm.imgList"
        :clubs="clubList"
        :max-stick-text-count="200"
        @submit="submitStick"
        @upload-success="uploadImageSuccess"
        @upload-error="uploadImageError"
        @remove-file="removeImage"
        @select-club="selectClub"
      />
      <template v-if="loading && refreshListStatus">
        <div class="bg-white p-[10px] list">
          <a-skeleton :animation="true">
            <a-space direction="vertical" :style="{ width: '100%' }" size="large">
              <template v-for="index in 3" :key="index">
                <a-skeleton-shape />
                <a-skeleton-line :rows="3" />
              </template>
            </a-space>
          </a-skeleton>
        </div>
      </template>
      <template v-else>
        <div ref="stickListRef" :loading="loading" class="list">
          <template v-if="stickList && stickList.length !== 0">
            <stick-card
              v-for="stick in stickList"
              ref="stickCardRef"
              :key="stick.stickId"
              v-model:comments="stick.comments.list"
              :comment-total="stick.comments.total"
              :author="stick.author"
              :show-follow-btn="false"
              :show-more-icon="true"
              :content="stick.content"
              :imgs="stick.imgList"
              :stick="stick"
              :list-show="true"
              :loading="submitLoading"
              @submit-comment="submitComment($event, stick.stickId)"
              @submit-reply="submitReply($event, stick.stickId)"
            />
          </template>
          <template v-else>
            <div class="bg-white py-[150px]">
              <a-empty description="当前暂无尺牍"></a-empty>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div class="side-bar w-[260px] top-[80px]">
      <div class="user-box bg-white px-[10px] py-[20px]">
        <div v-if="isLoginStatus" class="info flex flex-row justify-start items-center">
          <a-avatar :size="50">
            <img class="object-cover" :src="userInfo.avatar" />
          </a-avatar>
          <div class="ml-[10px] flex flex-col">
            <span class="text-base font-bold">{{ userInfo.nickname }}</span>
            <span class="text-xs leading-[30px] text-gray-500">{{ userInfo.short || '这个人很懒，什么都没有写' }}</span>
          </div>
        </div>
        <div v-else class="info flex flex-row justify-start items-center">
          <a-avatar :size="50">
            <IconUser />
          </a-avatar>
          <div class="ml-[10px] flex flex-col font-bold">
            <a-link @click="login">登录/注册</a-link>
          </div>
        </div>
        <a-divider />
        <div class="count flex flex-row flex-nowrap justify-center items-center">
          <router-link :to="{ name: 'SticksCreator' }" class="count-card flex flex-col items-center w-1/3">
            <span class="text-base font-bold">{{ !isLoginStatus ? '-' : userInfo.count?.stick }}</span>
            <span class="font-bold text-sm text-gray-400 mt-[5px]">尺牍</span>
          </router-link>
          <router-link
            :to="{ name: 'UserHome', params: { id: userInfo.userId }, query: { type: 'follow' } }"
            class="count-card flex flex-col items-center w-1/3"
          >
            <span class="text-base font-bold">{{ !isLoginStatus ? '-' : userInfo.count?.follow }}</span>
            <span class="font-bold text-sm text-gray-400 mt-[5px]">关注</span>
          </router-link>
          <router-link
            :to="{ name: 'UserHome', params: { id: userInfo.userId }, query: { type: 'fan' } }"
            class="count-card flex flex-col items-center w-1/3"
          >
            <span class="text-base font-bold">{{ !isLoginStatus ? '-' : userInfo.count?.fan }}</span>
            <span class="font-bold text-sm text-gray-400 mt-[5px]">粉丝</span>
          </router-link>
        </div>
      </div>
      <div class="bg-white mt-[20px] ads_swiper relative rounded-lg">
        <a-tag class="absolute top-2 left-2 z-40" color="arcoblue">推广</a-tag>
        <div class="ad-list mb-5">
          <swiper
            :modules="options.modules"
            navigation
            effect="fade"
            :autoplay="{ delay: 5000 }"
            :pagination="{ clickable: true }"
            :loop="true"
          >
            <swiper-slide v-for="slide in adList" :key="slide.slideId" class="slider-img">
              <a :href="slide.url" target="_blank">
                <img class="slider-img rounded-lg" :src="slide.imgUrl" />
              </a>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <div v-if="recommendSticks && recommendSticks.length !== 0" class="bg-white mt-[20px]">
        <div class="h-[50px] leading-[50px] px-[10px] border-b border-b-gray-100">
          <span class="font-bold text-base">尺牍推荐</span>
        </div>
        <div class="flex flex-col px-[10px]">
          <router-link
            v-for="stick in recommendSticks"
            :key="stick.stickId"
            :to="{ name: 'stickDetail', params: { id: stick.stickId } }"
            class="stick-card-recommend my-[10px]"
          >
            <div class="top flex flex-row flex-nowrap justify-center items-center">
              <div class="left flex-1 text-black flex flex-col">
                <span class="text-sm leading-6 line-clamp-2" v-html="stick.content"></span>
                <div class="count flex flex-row justify-start text-xs text-gray-500">
                  <div>
                    <span class="">{{ stick.likeCount }}</span
                    >赞
                  </div>
                  <div class="ml-[10px]">
                    <span class="num">{{ (stick?.commentCount || 0) + (stick?.replyCount || 0) }}</span
                    >评论
                  </div>
                </div>
              </div>
              <div v-if="stick.imgList && stick.imgList.length !== 0" class="right w-[64px] ml-[16px]">
                <img :src="stick.imgList[0].url" class="w-[64px] h-[64px] object-cover" />
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileItem, Message } from '@arco-design/web-vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import stickApi, { CreateStickDto, StickDto } from '@/api/modules/stick';
import useLoading from '@/hooks/loading';
import { Images } from '@/api/modules/default';
import { useUserStore } from '@/store/index';
import useSroll from '@/hooks/scroll';
import 'swiper/css/effect-fade';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

const { loading, setLoading } = useLoading();
const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading();
const { isLoginStatus } = useUserStore();

const options = ref({
  modules: [EffectFade, Autoplay, Pagination],
});

// 引入 css

const CreateStickModel = () => {
  return {
    content: '',
    imgList: [],
    link: undefined,
    themeId: undefined,
  };
};

interface Theme {
  themeId: number;
  name: string;
  cover: string;
  desc?: string;
  stickCount: number;
}

interface Club {
  clubId: number;
  name: string;
  desc?: string;
  themes: Array<Theme>;
}

const stickEditorRef = ref<any>();
const { userInfo } = useUserStore();
const injectHandle: any = inject('authModal');

const stickList = ref<Array<StickDto>>([]);
const selectThemeIndex = ref(0);
const selectClubsIndex = ref(0);
const clubList = ref<Array<Club>>([]);
const stickListRef = ref<any>();
const stickCardRef = ref<any>();
const refreshListStatus = ref(false);

const { isBottom } = useSroll(stickListRef.value); // 此处可传入滚动的dom实例

const recommendSticks = ref<Array<StickDto>>([]);

const basePagination: any = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const stickClubPagination = reactive({
  ...basePagination,
});

const publicStickPagination = reactive({
  ...basePagination,
});

const showThemeByClubIndex = ref(-1);

const fetchClubsData = async (params = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await stickApi.getPublicStickClubList(params);
    stickClubPagination.current = Number(params.current);
    stickClubPagination.total = Number(data.total);
    clubList.value = data.list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const stickSubmitForm = ref<CreateStickDto>(CreateStickModel());

const uploadImageError = (file: FileItem) => {
  if (file.response && file.response.code !== 0) {
    Message.error(file.response.message);
  }
};

const replaceUrl = (content: string) => {
  // const urlPattern = /^((https|http)?:\/\/)?([\w-]+\.?)+\.\w{2,}\/([^\/?#]+\/)*([^\/?#]+\/?)?(\?.+)?(#.+)?$/;
  // const reg = /((http|https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g;
  const reg: any =
    /((?!http[s]?:\/\/[A-Za-z0-9]+\.(?:png|jpg|gif|jpeg))(?!.*\.(?:png|jpg|gif|jpeg))http[s]?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]*(?![?&].*\.(?:png|jpg|gif|jpeg))[-A-Za-z0-9+&@#/%=~_|])/g;

  // let editorContent = decodeURIComponent(content);

  // // 使用正则表达式查找所有匹配的URL
  // const urls = editorContent.match(reg);
  // // 遍历所有找到的URL，并替换为<a>标签
  // if (urls) {
  //   console.log(urls, 'urls');
  //   const encodedUrl = urls[0];
  //   // 使用<a>标签包裹URL，其中href属性为URL，title属性为URL的原始文本
  //   const link = `<a href="${encodedUrl}" title="${encodedUrl}">${encodedUrl}</a>`;
  //   // 在原始文本中找到URL的位置，并替换为<a>标签
  //   editorContent = editorContent.replace(encodedUrl, link);
  // }
  const textR = content.replace(
    reg,
    "<a href='$1' target='_blank' style='color: #eb7340;width: 80px;display: inline;'>网页链接</a>",
  );
  console.log(textR);
  return textR;
};
const clearStickEditor = () => {
  stickSubmitForm.value = CreateStickModel();
  (stickEditorRef.value as any).clear();
  //
};
const submitComment = (commentForm: any, stickId: number | string) => {
  setSubmitLoading(true);
  stickApi
    .submitStickComment({
      ...commentForm,
      stickId,
    })
    .then(async (res: any) => {
      if (res.code === 0) {
        Message.success('评论成功');
        const stickIndex = stickList.value.findIndex((stick: StickDto) => stick.stickId === stickId);
        try {
          const { data } = await stickApi.getPublicStickCommentList({ current: 1, pageSize: 5, stickId });
          stickList.value[stickIndex].comments.list = [...data.list];
          stickList.value[stickIndex].comments.total = data.total;
        } catch (err) {
          console.log(err, 'err');
        }
        stickCardRef.value[stickIndex].commentCountAdd();
        clearStickEditor();
      } else {
        Message.error(res.message || 'dasda');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const submitReply = (commentForm: any, stickId: number | string) => {
  const { commentId, replyForm, replyId, commentAccount, receiverId } = commentForm;
  const stickIndex = stickList.value.findIndex((stick: StickDto) => stick.stickId === stickId);
  stickApi
    .submitStickCommentReply({
      commentId,
      ...replyForm,
      stickId,
      receiverId,
    })
    .then(async (res: any) => {
      if (res.code === 0) {
        Message.success('回复成功');
        const commentIndex = stickList.value[stickIndex].comments.list.findIndex(
          (comment: any) => comment.commentId === commentId,
        );
        stickList.value[stickIndex].comments.list[commentIndex].replys.list.unshift({
          receiverAccount: commentAccount,
          receivedAccountId: receiverId,
          ...res.data,
          stickId,
          replyAccount: userInfo,
          replyAccountId: userInfo.userId,
        });
        stickCardRef.value[stickIndex].commentCountAdd();
        clearStickEditor();
      } else {
        Message.error(res.message || 'dasda');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchData = async (params: any) => {
  setLoading(true);
  try {
    const { data } = await stickApi.getPublicStickList(params);
    publicStickPagination.current = Number(params.current);
    publicStickPagination.total = Number(data.total);
    stickList.value.push(...data.list);
    isBottom.value = false;
    refreshListStatus.value = false;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const adList = ref<Array<any>>([
  {
    name: '轩辕剑三上线STEAM',
    url: 'https://store.steampowered.com/app/1638230/_/?curator_clanid=4777282',
    imgUrl: 'https://s1.ax1x.com/2023/07/31/pP9Z9QP.jpg',
  },
  // {
  //   name: '胡玩文化——拓跋玉儿可动兵人手办潮玩',
  //   url: 'https://weibo.com/7765795702/Ma8zv6pnl?pagetype=profilefeed',
  //   imgUrl: 'https://s1.ax1x.com/2023/08/07/pPEkmhF.jpg',
  // },
]);

watch(isBottom, (newIsBottom) => {
  // newIsBottom如果true
  if (newIsBottom) {
    // 书写触底刷新代码, 记得刷新重置isBottom为false
    if (publicStickPagination.total > stickList.value.length) {
      publicStickPagination.current += 1;
      fetchData({
        ...publicStickPagination,
      });
      isBottom.value = false;
    }
  }
});

const selectDefault = () => {
  showThemeByClubIndex.value = -1;
  selectClubsIndex.value = 0;
  selectThemeIndex.value = 0;
  publicStickPagination.current = 1;
  stickList.value = [];
  fetchData({ ...publicStickPagination });
};

const fetchCommentsData = async (params = { current: 1, pageSize: 10 }) => {
  // setLoading(true);
  try {
    const { data } = await stickApi.getPublicStickCommentList(params);
    publicStickPagination.current = Number(params.current);
    publicStickPagination.total = Number(data.total);
    stickList.value = data.list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    // setLoading(false);
  }
};

const fetchRecommendSticksData = async () => {
  // setLoading(true);
  try {
    const { data } = await stickApi.getPublicStickRecommendList();
    recommendSticks.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    // setLoading(false);
  }
};

const selectClubIndex = (clubId: number) => {
  showThemeByClubIndex.value = clubId;
  selectClubsIndex.value = clubId;
  const selectClubs = clubList.value.findIndex((club) => club.clubId === clubId);
  selectThemeIndex.value = clubList.value[selectClubs].themes[0].themeId;
  publicStickPagination.current = 1;
  stickList.value = [];
  fetchData({ ...publicStickPagination, themeId: clubList.value[selectClubs].themes[0].themeId });
};

const selectTheme = (themeId: number, clubId: number) => {
  selectThemeIndex.value = themeId;
  selectClubsIndex.value = clubId;
  publicStickPagination.current = 1;
  stickList.value = [];
  refreshListStatus.value = true;
  fetchData({ ...publicStickPagination, themeId });
};
// const actionMoreComments = async (stickId: number) => {
//   const list = await fetchCommentsData({
//     ...publicStickCommentPagination,
//     stickId,
//   });
// };

const submitStick = () => {
  // 前两天在沸点看到一个兄弟发的屎上雕花那个图有谁保存了吗，发一下，急用[吃瓜群众]前两天在沸点看到一个兄弟发的屎上雕花那个图有谁保存了吗，发一下，急用[吃瓜群众]前两天在沸点看到一个兄弟发的屎上雕花那个图有谁保存了吗，发一下，急用[吃瓜群众]前两天在沸点看到一个兄弟发的屎上雕花那个图有谁保存了吗，发一下，急用[吃瓜群众]
  // stickSubmitForm.value.content =
  const { content, ...form } = stickSubmitForm.value;
  stickApi
    .submitStick({
      ...form,
      content: replaceUrl(content),
    })
    .then((res) => {
      if (res.code === 0) {
        Message.success('尺牍发布成功');
        stickList.value = [];
        fetchData({ ...publicStickPagination });
        clearStickEditor();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const uploadImageSuccess = (fileItem: FileItem) => {
  if (fileItem.response.data.url) {
    (stickSubmitForm.value.imgList as Array<Images>).push(fileItem.response.data);
  }
};

const removeImage = (removeIndex: number) => {
  stickSubmitForm.value.imgList?.splice(removeIndex, 1);
};

const selectClub = (id?: number) => {
  stickSubmitForm.value.themeId = id;
};

const login = () => {
  injectHandle.openAuthModal('login');
};

onMounted(() => {
  fetchClubsData({
    ...stickClubPagination,
  });
  fetchData({
    ...publicStickPagination,
  });
  fetchRecommendSticksData();
});
</script>

<style lang="scss" scoped>
.stick-container {
  @apply w-[1200px] mt-[80px] flex flex-row flex-nowrap items-start justify-between mx-auto;
}

.post-nav {
  width: 150px;
  // position: sticky;
  // top: 80px;
  margin-right: 20px;
  height: fit-content;
  border-radius: 4px;
}

.stick-list {
  width: 720px;

  :deep(.w-e-text-container) {
    @apply bg-gray-100 rounded-sm focus:invalid:ring-pink-500 placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500;

    p {
      margin: 5px 0;
      line-height: 24px;
      position: relative;
      white-space: pre-wrap;
    }
  }
}

.list {
  @apply my-[20px] relative w-full;
}
</style>
