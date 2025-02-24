<template>
  <div class="message-container">
    <div
      :class="[
        'message-box',
        comments && comments.length === 0 ? ' min-h-[600px]' : `min-h-[${comments.length * 100 + 350}px]`,
      ]"
    >
      <div class="child-top-nav">
        <router-link
          v-for="(nav, index) in navList"
          :key="index"
          :to="{ name: 'ReplyMessage', query: { type: nav.value } }"
          :class="[selectNav === nav.value ? 'nav-selected' : '', 'child-nav']"
          @click="changeSelectNav(nav.value)"
          >{{ nav.name }}</router-link
        >
      </div>
      <template v-if="selectNav === 'post'">
        <template v-if="comments && comments.length !== 0">
          <div v-for="item in comments" :key="item.commentId" v-loading="loading" class="">
            <div v-if="item.post" class="like-card">
              <div class="flex flex-row justify-start items-start">
                <a-avatar :size="40"> <img :src="item.replyAccount.avatar" /> </a-avatar>
                <div class="info flex flex-col justify-center items-start ml-[10px]">
                  <div class="name-line flex flex-row justify-start items-center">
                    <router-link :to="`/u/${item.replyAccount.userId}`" class="text-base font-bold">{{
                      item.replyAccount.nickname
                    }}</router-link>
                    <div class="flex flex-row items-center">
                      <div class="text-sm text-gray-600 ml-[10px]">
                        在帖子
                        <router-link
                          class="ml-[5px] text-gray-800 font-bold"
                          :to="{ name: 'PostDetail', params: { postId: item.post.postId } }"
                          >《{{ item.post.title }}》</router-link
                        >
                        中回复了你
                      </div>
                    </div>
                  </div>
                  <div>
                    <router-link
                      :to="{ name: 'PostDetail', params: { postId: item.post.postId } }"
                      class="text-black text-base block leading-[30px]"
                    >
                      <span v-html="renderedContent(item.content)"></span>
                    </router-link>
                  </div>
                  <span class="mt-[5px] text-gray-500 block">{{ dayjs(item.createdAt).fromNow() }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex flex-row justify-center items-center">
            <a-pagination
              class="mb-[30px]"
              :page-size="pagination.pageSize"
              :current="pagination.current"
              :total="pagination.total"
              @change="changePagination"
            />
          </div>
        </template>
        <template v-else>
          <a-empty class="mt-[200px]" description="当前暂无回复" />
        </template>
      </template>
      <template v-if="selectNav === 'stick'">
        <template v-if="comments && comments.length !== 0">
          <div v-for="item in comments" :key="item.commentId" v-loading="loading" class="">
            <div v-if="item.stick" class="like-card">
              <div class="flex flex-row justify-start items-start">
                <a-avatar :size="40"> <img :src="item.replyAccount.avatar" /> </a-avatar>
                <div class="info flex flex-col justify-center items-start ml-[10px]">
                  <div class="name-line flex flex-row justify-start items-center">
                    <router-link :to="`/u/${item.replyAccount.userId}`" class="text-base font-bold">{{
                      item.replyAccount.nickname
                    }}</router-link>
                    <div class="flex flex-row items-center">
                      <div class="ml-[10px] mr-[5px] text-sm text-gray-600 flex flex-row justify-start items-center">
                        在尺牍
                        <router-link
                          class="ml-[10px] mr-[10px] text-gray-800 font-bold max-w-[300px] overflow-ellipsis overflow-hidden whitespace-nowrap block"
                          :to="{ name: 'stickDetail', params: { id: item.stick.stickId } }"
                        >
                          <span class="" v-html="renderedContent(item.stick.content)"></span>
                        </router-link>
                        中回复了你
                      </div>
                    </div>
                  </div>
                  <div>
                    <router-link
                      :to="{ name: 'stickDetail', params: { id: item.stick.stickId } }"
                      class="text-black text-base block leading-[30px]"
                      v-html="renderedContent(item.content)"
                    ></router-link>
                  </div>
                  <span class="mt-[5px] text-gray-500 block">{{ dayjs(item.createdAt).fromNow() }}</span>
                </div>
              </div>
              <div v-if="item.stick.imgList && item.stick.imgList.length !== 0" class="">
                <img :src="item.stick.imgList[0].url" class="w-[80px] h-[80px] object-cover" />
              </div>
            </div>
          </div>
          <div class="w-full flex flex-row justify-center items-center">
            <a-pagination
              class="mb-[30px]"
              :page-size="pagination.pageSize"
              :current="pagination.current"
              :total="pagination.total"
              @change="changePagination"
            />
          </div>
        </template>
        <template v-else>
          <a-empty class="mt-[200px]" description="当前暂无回复" />
        </template>
      </template>
      <template v-if="selectNav === 'work'">
        <template v-if="comments && comments.length !== 0">
          <div v-for="item in comments" :key="item" v-loading="loading" class="">
            <div v-if="item.work" class="like-card">
              <div class="flex flex-row justify-start items-start">
                <a-avatar :size="40"> <img :src="item.replyAccount.avatar" /> </a-avatar>
                <div class="info flex flex-col justify-center items-start ml-[10px]">
                  <div class="name-line flex flex-row justify-start items-center">
                    <router-link :to="`/u/${item.replyAccount.userId}`" class="text-base font-bold">{{
                      item.replyAccount.nickname
                    }}</router-link>
                    <div class="flex flex-row items-center">
                      <div class="text-sm text-gray-600 ml-[10px] mr-[10px] flex flex-row items-center justify-start">
                        在同人作品
                        <router-link
                          class="ml-[5px] text-gray-800 font-bold block"
                          :to="{ name: 'workDetail', params: { id: item.work.workId } }"
                          >《{{ item.work.title }}》</router-link
                        >
                        中回复了你
                      </div>
                    </div>
                  </div>
                  <div>
                    <router-link
                      :to="{ name: 'workDetail', params: { id: item.work.workId } }"
                      class="text-black text-base block leading-[30px]"
                      v-html="renderedContent(item.content)"
                    ></router-link>
                  </div>
                  <span class="mt-[5px] text-gray-500 block">{{ dayjs(item.createdAt).fromNow() }}</span>
                </div>
              </div>
              <div v-if="item.work.cover" class="">
                <img :src="item.work.cover" class="w-[80px] h-[80px] object-cover" />
              </div>
            </div>
          </div>
          <div class="w-full flex flex-row justify-center items-center">
            <a-pagination
              class="mb-[30px]"
              :page-size="pagination.pageSize"
              :current="pagination.current"
              :total="pagination.total"
              @change="changePagination"
            />
          </div>
        </template>
        <template v-else>
          <a-empty class="mt-[200px]" description="当前暂无回复" />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import defaultApi from '@/api/modules/default';
import { Pagination } from '@/utils/global';
import useLoading from '@/hooks/loading';
import dayjs from '@/utils/dayjs';

const { loading, setLoading } = useLoading();
const route = useRoute();

const selectNav = ref('post');
const navList = ref([
  {
    name: '帖子',
    value: 'post',
  },
  {
    name: '尺牍',
    value: 'stick',
  },
  {
    name: '同人作品',
    value: 'work',
  },
]);
const comments = ref([]);

const injectHandle: any = inject('topHeader');

const renderedContent = (str: string) => {
  return DOMPurify.sanitize(str);
};

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const readReplyRecord = (type: string) => {
  const recordIds = [];
  comments.value.forEach((comment: any) => {
    if (!comment.readStatus) {
      recordIds.push(comment.replyId);
    }
  });
  defaultApi
    .sendReadReplyRecord({
      type,
      recordIds,
    })
    .then((res) => {
      if (res.code === 0) {
        console.log('已读消息');
      }
    });
};

const pagination = reactive({
  ...basePagination,
});

const fetchData = async (params = { current: 1, pageSize: 10, type: 'post' }) => {
  setLoading(true);
  const { data } = await defaultApi.getReplysList(params);
  pagination.current = Number(params.current);
  pagination.total = Number(data.total);
  comments.value = data.list;
  readReplyRecord(selectNav.value);
  injectHandle.getCommentCount();
};

const changePagination = (current: number) => {
  basePagination.current = current;
  fetchData({
    ...basePagination,
    type: selectNav.value,
  });
};

const changeSelectNav = (value: string) => {
  selectNav.value = value;
  basePagination.current = 1;
  fetchData({
    ...basePagination,
    type: value,
  });
};

onMounted(() => {
  const { type } = route.query;
  if (type) {
    changeSelectNav(type as string);
    // readLikeRecord(type as string);
  } else {
    changeSelectNav('post');
    // readLikeRecord('post');
  }
});
</script>

<style lang="scss" scoped>
.message-container {
  .top-nav-bar {
    @apply min-h-[50px] max-h-[100px] bg-white w-full shadow-lg top-[60px] fixed left-0 z-[100];
    box-shadow: inset 0 5px 15px -10px rgba($color: #000000, $alpha: 0.2);
    .nav-list {
      @apply h-[50px] mx-auto w-[960px] 2xl:w-[1200px] flex flex-row justify-center items-center;
      .nav-item {
        @apply text-sm text-center text-gray-500 mx-[30px] cursor-pointer leading-[50px];
      }
      .nav-selected {
        @apply text-blue-600 font-bold;
      }
    }

    .child-nav-list {
      @apply h-[30px] mx-auto w-[960px] 2xl:w-[1200px] flex flex-row justify-center items-center;
      .nav-item {
        @apply text-[12px] text-center text-gray-500 mx-[30px] cursor-pointer leading-[30px];
      }
      .nav-selected {
        @apply text-blue-600 font-bold;
      }
    }
  }
  .message-box {
    @apply w-[960px] 2xl:w-[1200px]  bg-white mx-auto mt-[150px] mb-[30px];
  }
}

.fan-card {
  margin: 0 calc(10% / 4);
  @apply w-[45%] flex flex-row justify-between items-center px-[15px] my-[10px] border border-gray-200 rounded-sm py-[15px];
}

.like-card {
  @apply flex flex-row justify-between items-center px-[20px] pb-[10px] my-[10px] rounded-sm border-b border-gray-100;
}

.child-top-nav {
  @apply h-[50px] leading-[50px] flex flex-row justify-center items-center border-b border-gray-100;
  .child-nav {
    @apply w-1/3 block text-center cursor-pointer relative hover:font-bold hover:text-blue-600;

    &:hover::after {
      content: '';
      @apply block h-[3px] w-[60%] bg-blue-600 mx-auto absolute bottom-0 left-[20%];
    }
  }
}

.child-top-nav {
  @apply h-[50px] leading-[50px] flex flex-row justify-center items-center border-b border-gray-100;
  .child-nav {
    @apply w-1/3 block text-center cursor-pointer relative hover:font-bold hover:text-blue-600;

    &:hover::after {
      content: '';
      @apply block h-[3px] w-[50%] bg-blue-600 mx-auto absolute bottom-0 left-[25%];
    }
  }

  .nav-selected {
    &::after {
      content: '';
      @apply block h-[3px] w-[50%] bg-blue-600 mx-auto absolute bottom-0 left-[25%];
    }
  }
}
</style>
