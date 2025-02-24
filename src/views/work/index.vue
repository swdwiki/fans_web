<template>
  <div class="work-container">
    <!-- <div class="swiper">
      <WorkSwiper />
    </div> -->
    <div class="work-index-list">
      <div class="tabs min-h-[60px] max-h-[100px]">
        <div
          class="parent-cate flex flex-row justify-center items-center h-[54px] border-b border-gray-200 relative w-full"
        >
          <div
            :class="selectTabIndex === -1 ? 'border-b border-b-black' : ''"
            class="h-[54px] leading-[54px] mx-[20px]"
            @click="selectWorkIndexTab(-1)"
          >
            <span
              class="cate-name cate-parent-name"
              :class="selectTabIndex === -1 ? 'font-bold text-black ' : 'text-[#888]'"
              >全部</span
            >
          </div>
          <div
            v-for="(tab, index) in tablist"
            :key="index"
            :class="selectParentCateId === tab.cateId && selectTabIndex === index ? 'border-b border-b-black' : ''"
            class="h-[54px] leading-[54px] mx-[20px]"
            @click="selectWorkIndexTab(index, tab.cateId)"
          >
            <span
              class="cate-name cate-parent-name"
              :class="
                selectParentCateId === tab.cateId && selectTabIndex === index ? 'font-bold text-black ' : 'text-[#888]'
              "
              >{{ tab.name }}</span
            >
          </div>
          <div v-if="userInfo.isR18" class="absolute right-0 flex flex-row items-center h-[54px] top-[3px]">
            <a-trigger
              position="br"
              trigger="click"
              :auto-fit-position="false"
              :unmount-on-close="false"
              :scroll-to-close="true"
            >
              <div class="flex flex-row items-center">
                <icon-settings size="16" style="color: #888" />
                <span class="text-xs text-[#888] ml-[3px]">浏览设置</span>
              </div>
              <template #content>
                <div
                  class="flex flex-col justify-start items-center bg-white rounded-sm border border-gray-100 p-[10px]"
                >
                  <div class="float-left my-[5px]">
                    <span class="mr-[10px] text-xs">开启18+</span>
                    <a-switch v-model="readOptions.isR18" size="small">
                      <template #unchecked>
                        <span class="text-[#888]">关闭</span>
                      </template>
                      <template #checked>
                        <span>开启</span>
                      </template>
                    </a-switch>
                  </div>
                  <div v-if="readOptions.isR18 && userInfo.isGrotesque" class="my-[5px]">
                    <span class="mr-[10px] text-xs">开启G向</span>
                    <a-switch v-model="readOptions.isGrotesque" size="small">
                      <template #unchecked>
                        <span class="text-[#888]">关闭</span>
                      </template>
                      <template #checked>
                        <span>开启</span>
                      </template>
                    </a-switch>
                  </div>
                  <div class="handle my-[10px]">
                    <a-button class="mx-[5px]" size="mini" type="primary" @click="submitReadOptions">确定</a-button>
                    <a-button class="mx-[5px]" size="mini" status="normal" @click="resetReadOptions">重置</a-button>
                  </div>
                </div>
              </template>
            </a-trigger>
          </div>
        </div>
        <div
          v-if="tablist[selectTabIndex]?.children"
          class="child-cate flex flex-row justify-center items-center h-[50px] my-[10px]"
        >
          <div class="my-[10px] mx-[10px] min-w-[50px] max-w-[120px]">
            <span
              class="cate-name cate-child-name"
              :class="selectTabChildIndex === 0 ? 'bg-blue-500 text-white' : 'bg-white text-[#888]'"
              @click="selectTabChildIndexTab(0)"
              >全部</span
            >
          </div>
          <div
            v-for="(child, index) in tablist[selectTabIndex]?.children"
            :key="index"
            class="my-[10px] mx-[10px] min-w-[50px] max-w-[120px]"
            @click="selectTabChildIndexTab(child.cateId)"
          >
            <span
              class="cate-name cate-child-name"
              :class="selectTabChildIndex === child.cateId ? 'bg-blue-500 text-white' : 'bg-white text-[#888]'"
              >{{ child.name }}</span
            >
          </div>
        </div>
      </div>
      <div class="work-list">
        <template v-if="workList && workList.length !== 0 && pagination.total !== 0">
          <work-card
            v-for="work in workList"
            :key="work.workId"
            :work="work"
            :show-status="false"
            :status="work.status"
            :show-more="false"
          ></work-card>
        </template>
        <template v-else>
          <div class="w-full empty flex flex-row items-center justify-center pt-[100px]">
            <a-empty description="暂无作品"></a-empty>
          </div>
        </template>
      </div>
      <div v-if="workList && workList.length !== 0 && pagination.total !== 0" class="w-full flex items-center">
        <a-pagination
          class="mx-auto my-[20px]"
          :total="pagination.total"
          :current="pagination.current"
          :page-size="pagination.pageSize"
          size="large"
          @change="changePage"
        ></a-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import workApi, { WorkParams } from '@/api/modules/work';
import useLoading from '@/hooks/loading';
import { useUserStore } from '@/store';

const selectTabIndex = ref(-1);
const selectTabChildIndex = ref(0);
const selectParentCateId = ref(0);
const { loading, setLoading } = useLoading();
const { userInfo, isLoginStatus } = useUserStore();
const readOptions = ref({
  isR18: false,
  isGrotesque: false,
});

const tablist = ref<any>([]);

const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
});

const queryWorkParams = ref<WorkParams>({});

const workList = ref<any>([]);

const queryWorkCateList = () => {
  workApi.queryCateList().then((res) => {
    if (res.code === 0) {
      tablist.value.push(...res.data.list);
    }
  });
};

const queryWorkList = (params: WorkParams = { current: 1, pageSize: 20 }) => {
  setLoading(true);
  workApi.queryWorkList(params).then((res) => {
    if (res.code === 0) {
      workList.value = res.data.list;
      pagination.value.total = res.data.total;
      setLoading(false);
    }
  });
};

const selectWorkIndexTab = (value: number, cateId?: number) => {
  selectTabIndex.value = value;
  selectTabChildIndex.value = 0;
  if (cateId) {
    selectParentCateId.value = cateId;
    queryWorkParams.value.parentCateId = cateId;
  } else {
    delete queryWorkParams.value.parentCateId;
  }
  delete queryWorkParams.value.cateId;
  pagination.value.current = 1;
  queryWorkList({ ...pagination.value, ...queryWorkParams.value, ...readOptions.value });
};
const selectTabChildIndexTab = (value: number) => {
  selectTabChildIndex.value = value;
  if (value !== 0) {
    queryWorkParams.value.cateId = value;
  } else {
    delete queryWorkParams.value.cateId;
  }
  pagination.value.current = 1;
  queryWorkList({ ...pagination.value, ...queryWorkParams.value, ...readOptions.value });
};

const submitReadOptions = () => {
  // 这里要存储设置到本地
  localStorage.setItem('workReadOptions', JSON.stringify(readOptions.value));
  pagination.value.current = 1;
  // console.log(readOptions.value);
  queryWorkList({ ...pagination.value, ...queryWorkParams.value, ...readOptions.value });
};

const changePage = (current: number) => {
  pagination.value.current = current;
  queryWorkList({ ...pagination.value, ...queryWorkParams.value, ...readOptions.value });
};

const resetReadOptions = () => {
  readOptions.value = {
    isR18: false,
    isGrotesque: false,
  };
  localStorage.setItem('workReadOptions', JSON.stringify(readOptions.value));
  pagination.value.current = 1;
  queryWorkList({ ...pagination.value, ...queryWorkParams.value, ...readOptions.value });
};

onMounted(() => {
  queryWorkCateList();
  const option = localStorage.getItem('workReadOptions');
  if (option) {
    readOptions.value = JSON.parse(option);
  } else {
    readOptions.value = {
      isR18: false,
      isGrotesque: false,
    };
    localStorage.setItem('workReadOptions', JSON.stringify(readOptions.value));
  }
  queryWorkList({ ...pagination.value, ...readOptions.value });
});
</script>

<style lang="scss" scoped>
.work-container {
  @apply lg:w-[1200px] 2xl:w-[1480px] mx-auto mt-[80px];

  .swiper {
    @apply w-[100%] mx-auto;
  }
}

.work-index-list {
  @apply mt-[30px];
}

.work-list {
  @apply flex flex-row flex-wrap mt-[20px] justify-start items-start w-full;
}

.cate-name {
  @apply cursor-pointer block px-[20px] py-[5px];
}
.cate-parent-name {
  @apply text-[16px] hover:font-bold;
}

.cate-child-name {
  @apply text-[14px] box-border rounded-full px-[20px] py-[5px] hover:bg-blue-500 hover:text-white;
}

.cate-child-name:hover::after {
  display: block;
  content: attr(title);
  visibility: hidden;
  height: 1px;
  color: transparent;
  margin-bottom: -1px;
  @apply font-bold overflow-hidden;
}
</style>
