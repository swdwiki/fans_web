<template>
  <div class="columns_list">
    <a-modal :visible="handleWorkVisible" @before-ok="handleWork" @cancel="handleWorkVisible = false">
      <template #title> 同人作品{{ handleType && handleTypeOption[handleType].label }} </template>
      <div>
        {{ handleType && handleTypeOption[handleType].message }}
      </div>
    </a-modal>
    <div class="header">
      <div class="header-content">同人作品管理</div>
    </div>
    <div class="list p-5 min-h-[700px]">
      <a-tabs :active-key="selectStatus" type="rounded" size="large" @change="changeStatusTab">
        <a-tab-pane v-for="status in statusList" :key="status.value" :title="status.label">
          <div v-if="workPagination.total !== 0 && workList && workList.length !== 0" class="flex flex-row flex-wrap">
            <work-card
              v-for="item in workList"
              :key="item.workId"
              :work="item"
              :show-more="true"
              :show-status="true"
              :status="(item.status as number)"
            >
              <template #more_action>
                <div class="btn-groups">
                  <span class="btn" @click="updateWork(item.workId)">编辑</span>
                  <span v-if="item.status === 1" class="btn" @click="changeWorkStatus(item.workId, 'down')">下架</span>
                  <span v-if="item.status === 3" class="btn" @click="changeWorkStatus(item.workId, 'up')">上架</span>
                  <span class="btn" @click="changeWorkStatus(item.workId, 'delete')">删除</span>
                </div>
              </template>
            </work-card>
          </div>
          <div v-else class="flex flex-col justify-center items-center">
            <a-empty class="mt-40" description="暂无同人作品"></a-empty>
            <router-link :to="{ name: 'workEditor' }" target="_blank">
              <a-button class="mt-5" type="outline">开始创作</a-button>
            </router-link>
          </div>
          <a-pagination
            v-if="workPagination.total > 9"
            class="my-[15px] mx-auto"
            :page-size="workPagination.pageSize"
            :current="workPagination.current"
            :total="workPagination.total"
            show-total
            @change="changePage"
          />
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
import workApi, { WorkItem } from '@/api/modules/work';

const handleWorkVisible = ref(false);
const { setLoading } = useLoading(true);

const route = useRoute();
const router = useRouter();
const workList = ref<Array<WorkItem>>([]);
const selectStatus = ref<string>('');

const handleTypeOption = ref<any>({
  up: {
    label: '上架',
    message: '是否确定上架该作品？',
  },
  down: {
    label: '下架',
    message: '是否确定下架该作品？',
  },
  delete: {
    label: '删除',
    message: '是否确定删除该作品？',
  },
});

const statusList = ref([
  {
    label: '全部',
    value: 'all',
    status: -1,
  },
  {
    label: '已发布',
    value: 'published',
    status: 1,
  },
  {
    label: '已下架',
    value: 'unpublished',
    status: 3,
  },
]);

const handleType = ref('');

const basePagination: Pagination = {
  current: 1,
  pageSize: 9,
  total: 0,
};

const workPagination = reactive({
  ...basePagination,
});

const selectWorkId = ref(0);

const updateWork = (workId: number) => {
  router.push({
    name: 'updateWorkEditor',
    params: {
      id: workId,
    },
  });
};

const fetchData = async (
  params: { current: number; pageSize: number; status?: string } = { current: 1, pageSize: 9 },
) => {
  setLoading(true);
  try {
    const { data } = await workApi.creatorWorkList(params);
    workList.value = data.list;
    workPagination.current = Number(params.current);
    workPagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const clearFetch = () => {
  workPagination.current = 1;
  fetchData({ ...workPagination, status: selectStatus.value });
};

const changePage = (current: number) => {
  workPagination.current = current;
  fetchData({ ...workPagination, status: selectStatus.value });
};

const changeWorkStatus = (workId: number, type: 'down' | 'up' | 'delete') => {
  handleType.value = type;
  handleWorkVisible.value = true;
  selectWorkId.value = workId;
};

const handleWork = (done: any) => {
  if (handleType.value === 'up') {
    workApi
      .changeWorkStatus({
        workId: selectWorkId.value,
        status: 1,
      })
      .then((res: any) => {
        if (res.code === 0) {
          Message.success('帖子上架成功');
          clearFetch();
          done(true);
          handleWorkVisible.value = false;
        } else {
          Message.error('帖子上架失败');
          done(false);
        }
      })
      .catch((err: any) => {
        Message.error('帖子上架失败');
        done(false);
      });
  } else if (handleType.value === 'down') {
    workApi
      .changeWorkStatus({
        workId: selectWorkId.value,
        status: 3,
      })
      .then((res: any) => {
        if (res.code === 0) {
          Message.success('帖子下架成功');
          done(true);
          clearFetch();
          handleWorkVisible.value = false;
        } else {
          Message.error('帖子下架失败');
          done(false);
        }
      })
      .catch((err: any) => {
        Message.error('帖子下架失败');
        done(false);
      });
  } else if (handleType.value === 'delete') {
    workApi.deleteWork(selectWorkId.value).then((res) => {
      if (res.code === 0) {
        Message.success('删除成功');
        done(true);
        handleWorkVisible.value = false;
        clearFetch();
      } else {
        Message.error(res.message || '');
        done(false);
      }
    });
  }
};

const changeStatusTab = (tab: string | number) => {
  const statusInfoIndex = statusList.value.findIndex((status: any) => status.value === tab);
  const status = statusList.value[statusInfoIndex].value;
  selectStatus.value = status;
  fetchData({ ...workPagination, status: statusList.value[statusInfoIndex].value });
  router.replace({
    name: 'WorkCreator',
    query: {
      status: statusList.value[statusInfoIndex].value,
    },
  });
};

onMounted(() => {
  const { status } = route.query;
  if (!status)
    router.replace({
      name: 'WorkCreator',
      query: {
        status: statusList.value[0].value,
      },
    });
  selectStatus.value = status as string;

  const statusLabel = selectStatus.value || 'all';

  fetchData({ ...workPagination, status: statusLabel });
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

.btn-groups {
  @apply flex flex-col justify-center items-center bg-white w-[100px] shadow-lg rounded-md py-[10px];

  .btn {
    @apply w-full text-center cursor-pointer h-[40px] leading-[40px] hover:bg-gray-100;
  }
}
</style>
