<template>
  <div class="columns_list">
    <div class="header">
      <div class="header-content">文章管理</div>
    </div>
    <div class="list p-5 min-h-[700px]">
      <a-tabs :active-key="selectStatus" type="rounded" size="large" @change="changeStatusTab">
        <a-tab-pane v-for="status in statusList" :key="status.value" :title="status.label">
          <div v-if="postPagination.total !== 0 && postList && postList.length !== 0" class="flex flex-row flex-wrap">
            <creator-post-card
              v-for="post in postList"
              :key="post.postId"
              :post="post"
              @delete="deletePost"
              @update="updatePost"
              @down="downPost"
              @up="upPost"
            />
            <a-pagination
              class="my-[15px] mx-auto"
              :page-size="postPagination.pageSize"
              :current="postPagination.current"
              :total="postPagination.total"
              show-total
            />
          </div>
          <div v-else class="flex flex-col justify-center items-center">
            <a-empty class="mt-40" description="暂无文章"></a-empty>
            <router-link :to="{ name: 'editor' }" target="_blank">
              <a-button class="mt-5" type="outline">开始创作</a-button>
            </router-link>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FileItem, Message } from '@arco-design/web-vue';
import postApi, { Post, PostColumnParams } from '@/api/modules/post';
import useLoading from '@/hooks/loading';
import { Pagination, PostData } from '@/utils/global';
import useHeader from '@/hooks/header';

interface Column {
  columnId: number;
  name: string;
  cover: string;
  desc: string;
  status: string;
  posts: Array<any>;
}

const createColumnModel = () => {
  return {
    name: '',
    cover: '',
    desc: '',
  };
};

const updateColumnModel = () => {
  return {
    ...createColumnModel(),
    columnId: '',
  };
};

const createOrUpdateColumnRef = ref<any>(null);
const { setLoading } = useLoading(true);

const route = useRoute();
const router = useRouter();
const editStatus = ref(false);
const createOrUpdateColumnModal = ref(false);
const selectStatus = ref<string>('');
const createColumnForm = ref(createColumnModel());
const createOrUpdateColumnForm = ref(updateColumnModel());
const fileList = ref<Array<FileItem>>([]);

const columnsList = ref<Array<Column>>([]);

const postList = ref<Array<Post>>([]);

const statusList = ref([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '审核中',
    value: 'auditing',
  },
  {
    label: '已发布',
    value: 'published',
  },
  {
    label: '未发布/已下架',
    value: 'unpublished',
  },
  {
    label: '未通过',
    value: 'injected',
  },
  // {
  //   label: '草稿箱',
  //   value: 'draft',
  // },
]);

const { headers } = useHeader();

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const postPagination = reactive({
  ...basePagination,
});

const columnPagination = reactive({
  ...basePagination,
});

const updatePost = (postId: number) => {
  router.push({
    name: 'updateEditor',
    params: {
      id: postId,
    },
  });
};

const fetchData = async (params: PostColumnParams = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await postApi.creatorPostList(params);
    postList.value = data.list;
    postPagination.current = Number(params.current);
    postPagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const clearFetch = () => {
  postPagination.current = 1;
  fetchData({ ...postPagination, status: selectStatus.value });
};

const downPost = (postId: number) => {
  postApi
    .changePostStatus({
      postId,
      status: 2,
    })
    .then((res: any) => {
      if (res.code === 0) {
        Message.success('文章上架成功');
        clearFetch();
      } else {
        Message.error('文章上架失败');
      }
    });
};

const upPost = (postId: number) => {
  postApi
    .changePostStatus({
      postId,
      status: 3,
    })
    .then((res: any) => {
      if (res.code === 0) {
        Message.success('文章上架成功');
        clearFetch();
      } else {
        Message.error('文章上架失败');
      }
    });
};

const deletePost = (postId: number) => {
  postApi.deletePost(postId).then((res) => {
    if (res.code === 0) {
      Message.success('删除成功');
      clearFetch();
    } else {
      Message.error(res.message || '');
    }
  });
};

const changeStatusTab = (tab: string | number) => {
  const statusInfoIndex = statusList.value.findIndex((status: any) => status.value === tab);
  const status = statusList.value[statusInfoIndex].value;
  selectStatus.value = status;
  fetchData({ ...postPagination, status: statusList.value[statusInfoIndex].value });
  router.replace({
    name: 'PostsCreator',
    query: {
      status: statusList.value[statusInfoIndex].value,
    },
  });
};

onMounted(() => {
  const { status } = route.query;
  if (!status)
    router.replace({
      name: 'PostsCreator',
      query: {
        status: statusList.value[0].value,
      },
    });
  selectStatus.value = status as string;

  const statusLabel = selectStatus.value || 'all';

  // if (statusLabel !== 'all') {
  fetchData({ ...postPagination, status: statusLabel });
  // } else {
  //   fetchData({ ...basePagination });
  // }
});
</script>

<style lang="scss" scoped>
.columns_list {
  @apply bg-white w-full rounded-sm;

  .header {
    @apply h-14 leading-[3.5rem] px-5 text-base font-bold border-b-gray-100 border-b flex flex-row justify-between items-center;
  }
}
.demo-basic {
  // padding: 10px;
  width: 80px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
