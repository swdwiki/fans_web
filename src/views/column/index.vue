<template>
  <!-- 这是公共专栏页面 -->
  <div class="column-detail-wrap">
    <div class="column-info">
      <a-skeleton v-if="loading" v-loading="loading" :animation="true">
        <a-skeleton-line class="my-2"></a-skeleton-line>
        <a-skeleton-shape />
        <a-skeleton-line :rows="3" />
      </a-skeleton>
      <template v-else>
        <h1 class="title text-xl font-bold mt-0 mb-5 block">{{ columnInfo.name }}</h1>
        <div class="column-info-main flex flex-row">
          <img :src="columnInfo.cover" :alt="columnInfo.name" class="cover shadow-md" />
          <div class="info ml-5 flex flex-col justify-between items-start w-full">
            <div class="flex flex-col justify-start items-start">
              <div class="user-name-wrapper flex flex-row justify-start items-center">
                <a-avatar class="mr-2" :size="25">
                  <img class="shadow-lg" :src="columnInfo.user.avatar" />
                </a-avatar>
                <span class="font-bold text-sm">{{ columnInfo.user.nickname }}</span>
              </div>
              <p class="leading-6 text-sm py-2 text-gray-500">
                {{ columnInfo.desc }}
              </p>
            </div>
            <div class="bottom flex flex-row justify-between w-full items-center flex-nowrap">
              <span class="block">共{{ columnInfo.posts.length }}篇帖子</span>
              <span class="block">创建于{{ formatDate(columnInfo.createdAt) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="post_list mt-5 bg-white">
      <div
        class="h-14 leading-14 px-5 text-base font-bold border-b-gray-100 border-b flex flex-row justify-between items-center"
      >
        <div class="block w-1/6">
          <span>专栏帖子</span>
        </div>
        <!-- <div class="w-1/5">
          <a-select class="" placeholder="请选择排序方式">
            <a-option value="new" label="最新发布"></a-option>
            <a-option value="old" label="最早发布"></a-option>
          </a-select>
        </div> -->
      </div>
      <div class="list py-3 mb-20 min-h-[500px]">
        <template v-if="postList && postList.length !== 0">
          <div v-loading="postLoading" class="">
            <a-skeleton v-if="postLoading" v-loading="postLoading">
              <a-skeleton-line :rows="20"></a-skeleton-line>
            </a-skeleton>
            <template v-else>
              <post-card v-for="(post, index) in postList" :key="index" :post="post" />
            </template>
          </div>
          <a-pagination
            v-if="columnPostPagination.total > columnPostPagination.pageSize"
            :total="columnPostPagination.total || 0"
            :page-size="columnPostPagination.pageSize"
            class="my-5 flex flex-row justify-center items-center w-full"
            @change="changePage"
          ></a-pagination>
        </template>
        <a-empty v-else class="mt-[150px]" description="暂无帖子"></a-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import postApi from '@/api/modules/post';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import dayjs from '@/utils/dayjs';

const route = useRoute();
const router = useRouter();

const { columnId } = route.params;

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const columnPostPagination = reactive({
  ...basePagination,
});

const { loading, setLoading } = useLoading();

// const postLoading = ref(false);
const { loading: postLoading, setLoading: setPostLoading } = useLoading();

const formatDate = (time: string) => dayjs(time).format('YYYY-MM-DD');

const postList = ref([]);

const columnInfo = ref({
  columnId: '',
  name: '',
  desc: '',
  createdAt: '',
  posts: [],
  cover: '',
  user: {
    nickname: '',
    avatar: '',
    desc: '',
  },
});

const fetchData = async (params = { current: 1, pageSize: 10, columnId: route.params.columnId }) => {
  setPostLoading(true);
  try {
    const { data } = await postApi.getPostListByColumn(params);
    columnPostPagination.current = Number(params.current);
    columnPostPagination.total = Number(data.total);
    postList.value = data.list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setPostLoading(false);
  }
};

const changePage = (page: number) => {
  columnPostPagination.current = page;
  fetchData({ ...columnPostPagination, columnId });
};

onMounted(async () => {
  setLoading(true);
  if (!columnId || Number.isNaN(Number(columnId))) {
    router.replace({
      name: 'home',
    });
  }

  try {
    const { data } = await postApi.getColumn(Number(columnId));
    // const { posts } = data;
    columnInfo.value = data;
    // postList.value = [...columnInfo.value.posts];
    fetchData({ ...columnPostPagination, columnId });
    document.title = `${data.name}-${data.user.nickname}的专栏-轩辕天书`;
    setLoading(false);
  } catch (err) {
    router.replace({
      name: 'home',
    });
  }
});
</script>

<style lang="scss" scoped>
.column-detail-wrap {
  @apply mt-[80px] relative mx-auto w-full max-w-[960px];
  .column-info {
    @apply bg-white rounded-sm py-5 px-6 pb-6 overflow-hidden;
    .cover {
      width: 200px;
      height: calc(270px * 200px / 480px);
    }
  }
}
</style>
