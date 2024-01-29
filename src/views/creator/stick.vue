<template>
  <div class="columns_list">
    <div class="header">
      <div class="header-content">尺牍管理</div>
    </div>
    <div class="list p-5 min-h-[700px]">
      <a-tabs :active-key="selectStatus" type="rounded" size="large" @change="changeStatusTab">
        <a-tab-pane v-for="status in statusList" :key="status.value" :title="status.label">
          <div
            v-if="stickPagination.total !== 0 && stickList && stickList.length !== 0"
            class="flex flex-row flex-wrap"
          >
            <creator-stick-card
              v-for="stick in stickList"
              :key="stick.stickId"
              :stick="stick"
              :author="stick.author"
              :content="stick.content"
              :imgs="stick.imgList"
              :theme="stick.theme"
              @delete="deleteStick"
            />
            <a-pagination
              class="my-[15px] mx-auto"
              :page-size="stickPagination.pageSize"
              :current="stickPagination.current"
              :total="stickPagination.total"
              show-total
              @change="changePage"
            />
          </div>
          <div v-else class="flex flex-col justify-center items-center">
            <a-empty class="mt-40" description="暂无尺牍"></a-empty>
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
import { Message } from '@arco-design/web-vue';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import stickApi, { StickDto, StickListParams } from '@/api/modules/stick';

const { setLoading } = useLoading(true);

const route = useRoute();
const router = useRouter();
const selectStatus = ref<string>('');

const stickList = ref<Array<StickDto>>([]);

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
    label: '未通过',
    value: 'injected',
  },
]);

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const stickPagination = reactive({
  ...basePagination,
});

const fetchData = async (params: StickListParams = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await stickApi.creatorStickList(params);
    stickList.value = data.list;
    stickPagination.current = Number(params.current);
    stickPagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const clearFetch = () => {
  stickPagination.current = 1;
  fetchData({ ...stickPagination, status: selectStatus.value });
};

const deleteStick = (stickId: number) => {
  stickApi.deleteStick(stickId).then((res: any) => {
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
  fetchData({ ...stickPagination, status: statusList.value[statusInfoIndex].value });
  router.replace({
    name: 'SticksCreator',
    query: {
      status: statusList.value[statusInfoIndex].value,
    },
  });
};

const changePage = (page: number) => {
  stickPagination.current = page;
  fetchData({ ...stickPagination, status: selectStatus.value });
};

onMounted(() => {
  const { status } = route.query;
  if (!status)
    router.replace({
      name: 'SticksCreator',
      query: {
        status: statusList.value[0].value,
      },
    });
  selectStatus.value = status as string;

  const statusLabel = selectStatus.value || 'all';

  fetchData({ ...stickPagination, status: statusLabel });
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
