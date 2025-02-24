<template>
  <!-- 本页面是积分记录页面 -->
  <div class="score-container">
    <div class="top-header">
      <div class="left">
        <div class="goback">
          <icon-left :size="24" />
          <div class="goback-text text-base" @click="goback">返回</div>
        </div>
        <span class="title">我的经验值</span>
      </div>
      <span class="text-gray-500">签到规则说明</span>
    </div>
    <div class="list">
      <span class="title">经验值记录</span>
      <div class="list-table">
        <a-table
          :bordered="false"
          class="rounded-lg pb-[20px]"
          :data="expRecordList"
          :pagination="pagination"
          page-position="bottom"
          @page-change="changePage"
        >
          <template #columns>
            <a-table-column align="center" title="行为" data-index="time" :width="200">
              <template #cell="{ record }">
                {{ record.type.value }}
              </template>
            </a-table-column>
            <a-table-column align="center" title="经验值变化" data-index="exp" :width="200">
              <template #cell="{ record }"> {{ record.addType === 'add' ? '+' : '-' }}{{ record.exp }} </template>
            </a-table-column>
            <a-table-column align="center" title="时间" data-index="" :width="200">
              <template #cell="{ record }">
                {{ dayjs(record.createdAt).format('YYYY年MM月DD日 HH:mm:ss') }}
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from '@/utils/dayjs';
import defaultApi from '@/api/modules/default';

const router = useRouter();

const expRecordList = ref([]);

const basePagination = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const pagination = reactive({
  ...basePagination,
});

const goback = () => {
  router.go(-1);
};

const fetchData = async ({ current = 1, pageSize = 20 }) => {
  const res = await defaultApi.getExpRecordList({
    current,
    pageSize,
  });
  if (res.code === 0) {
    expRecordList.value = res.data.list;
    pagination.total = res.data.total;
  }
};

const changePage = (current: number) => {
  pagination.current = current;
  fetchData({ ...pagination, current });
};

onMounted(() => {
  fetchData({ ...pagination });
});
</script>

<style lang="scss" scoped>
.score-container {
  .top-header {
    @apply h-[60px] flex flex-row justify-between items-center px-[20px] bg-white;
    .left {
      @apply flex flex-row justify-start items-center;
      .goback {
        @apply text-gray-500 flex flex-row justify-start items-center pr-[20px] mr-[20px] border-r border-r-gray-300;
      }
      .title {
        @apply text-xl font-bold;
      }
    }
  }
  .list {
    @apply bg-white w-full my-[10px] p-[20px];
    .title {
      @apply text-base font-bold mb-[10px];
    }
    .list-table {
      @apply border border-gray-300 rounded-lg mt-[20px];
    }
  }
}
</style>
