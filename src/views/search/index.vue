<template>
  <div class="search-result-wrap">
    <div v-if="keywords" class="result-nav">
      <div v-for="(nav, index) in searchResultNav" :key="index" class="nav" @click="changeNav(nav.type)">
        <span :class="[selectNav === nav.type ? 'nav-selected' : 'nav-item']">{{ nav.name }}</span>
      </div>
    </div>
    <div class="search-input h-full w-[800px] mx-auto my-[40px] flex flex-row" :class="!keywords ? 'mt-[100px]' : ''">
      <a-input-search
        v-model="keywords"
        size="large"
        class="w-[600px]"
        placeholder="请输入要搜索的内容"
        search-button
        :style="{ background: '#ffffff' }"
        @search="search"
      />
      <a-link type="text" class="w-[100px]" @click="clearSearch">重置搜索</a-link>
    </div>

    <div class="result-box mb-[50px]" :class="[pagination.total === 0 ? 'h-[400px]' : 'h-full']">
      <!-- <span
        v-if="keywords"
        class="text-base w-full text-center block h-[50px] leading-[50px] border-b border-b-gray-100"
      >
        <span class="font-bold inline-block mx-[10px]">“{{ keywords }}”</span>的「{{
          searchResultNav.find((nav) => nav.type === selectNav)
            ? searchResultNav.find((nav) => nav.type === selectNav).name
            : ''
        }}」搜索结果
      </span> -->
      <div v-if="selectNav === 'post'" class="post-list">
        <template v-if="postList && postList.length !== 0">
          <post-card
            v-for="(item, index) in postList"
            :key="index"
            :post="item"
            :show-more="false"
            :show-status="false"
            :show-subject="true"
          ></post-card>
          <div class="w-full flex flex-row justify-center items-center my-[20px]">
            <a-pagination
              :current="pagination.current"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              hide-on-single-page
              @change="changePage"
            />
          </div>
        </template>
        <div v-else class="pt-[100px]">
          <a-empty description="没有搜索到相关内容" />
        </div>
      </div>
      <div v-if="selectNav === 'stick'" class="stick-list">
        <template v-if="stickList && stickList.length !== 0">
          <!-- <stick-card
            v-for="(item, index) in stickList"
            :key="index"
            :content="item.content"
            :show-more-icon="false"
            :author="item.author"
            :stick="item"
          ></stick-card> -->
          <router-link
            v-for="(item, index) in stickList"
            :key="index"
            :to="{ name: 'stickDetail', params: { id: item.stickId } }"
            class="flex flex-row justify-start items-start w-full"
          >
            <creator-stick-card
              :content="item.content"
              :show-more-btn="false"
              :author="item.author"
              :stick="item"
              :theme="item.theme"
              :imgs="item.imgs"
            ></creator-stick-card>
          </router-link>
          <div class="w-full flex flex-row justify-center items-center my-[20px]">
            <a-pagination
              :current="pagination.current"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              hide-on-single-page
              @change="changePage"
            />
          </div>
        </template>
        <div v-else class="pt-[100px]">
          <a-empty description="没有搜索到相关内容" />
        </div>
      </div>
      <div v-if="selectNav === 'work'" class="work-list">
        <template v-if="workList && workList.length !== 0">
          <div class="list">
            <work-card
              v-for="(item, index) in workList"
              :key="index"
              :work="item"
              :show-more="false"
              :show-status="false"
            ></work-card>
          </div>
          <div class="w-full flex flex-row justify-center items-center my-[20px]">
            <a-pagination
              :current="pagination.current"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              hide-on-single-page
              @change="changePage"
            />
          </div>
        </template>
        <div v-else class="pt-[100px]">
          <a-empty description="没有搜索到相关内容" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import defaultApi from '@/api/modules/default';

const basePagination = {
  total: 0,
  current: 1,
  pageSize: 12,
};

const keywords = ref('');
const router = useRouter();

const pagination = ref({
  ...basePagination,
});

const fetchData = async ({ keyword, type, pageSize = 20, current = 1 }) => {
  const res = await defaultApi.search({ keyword, type, pageSize, current });
  return res;
};

const selectNav = ref('post');
const postList = ref([]);
const stickList = ref([]);
const workList = ref([]);
const route = useRoute();

const clearSearch = () => {
  keywords.value = '';
  router.push({ name: 'SearchResult' });
  postList.value = [];
  stickList.value = [];
  workList.value = [];
  pagination.value.total = 0;
};

const searchResultNav = [
  {
    name: '帖子',
    type: 'post',
  },
  {
    name: '尺牍',
    type: 'stick',
  },
  {
    name: '同人作品',
    type: 'work',
  },
];

const changeNav = (nav: string) => {
  const { keyword, type } = route.query;
  if (type !== nav) {
    router.push({ name: 'SearchResult', query: { keyword, type: nav } });
  }
  selectNav.value = nav;
  pagination.value.current = 1;
  fetchData({ keyword, type: nav, ...pagination.value }).then((res) => {
    if (nav === 'post') {
      postList.value = res.data.list;
    } else if (nav === 'stick') {
      stickList.value = res.data.list;
    } else if (nav === 'work') {
      workList.value = res.data.list;
    }
    pagination.value.total = res.data.total;
  });
};

const search = (keyword: string) => {
  if (keyword && keyword.length !== 0) {
    router.push({ name: 'SearchResult', query: { keyword, type: selectNav.value } });
  } else {
    Message.error('请输入搜索关键字');
  }
};

const changePage = (page: number) => {
  pagination.value.current = page;
  fetchData({ keyword: keywords.value, type: selectNav.value, ...pagination.value }).then((res) => {
    if (selectNav.value === 'post') {
      postList.value = res.data.list;
    } else if (selectNav.value === 'stick') {
      stickList.value = res.data.list;
    } else if (selectNav.value === 'work') {
      workList.value = res.data.list;
    }
    pagination.value.total = res.data.total;
  });
};

watch(
  () => route,
  (newRoute, oldRoute) => {
    const { keyword, type } = newRoute.query;
    keywords.value = newRoute.query.keyword as string;
    if (keyword && type) {
      changeNav(newRoute.query.type as string);
    } else {
      clearSearch();
    }
  },
  { deep: true, immediate: true },
);
</script>

<style lang="scss" scoped>
.search-result-wrap {
  .result-nav {
    @apply mt-[60px] w-full bg-white h-[50px] leading-[50px] flex flex-row justify-center items-center px-[20px];
    box-shadow: inset 0 5px 15px -10px rgba($color: #000000, $alpha: 0.2);
    .nav {
      @apply mx-[50px];
    }

    .nav-item {
      @apply text-sm text-center text-gray-500  cursor-pointer leading-[50px];
    }
    .nav-selected {
      @apply text-blue-600 font-bold;
    }
  }

  .result-box {
    @apply my-[20px] w-[1000px] 2xl:w-[1280px] mx-auto bg-white;

    .work-list {
      @apply flex flex-row flex-wrap justify-center items-center pt-[30px] mb-[50px] pb-[10px];

      .list {
        @apply w-full mx-auto flex flex-row flex-wrap justify-start ml-[50px] items-center;
      }
    }

    .post-list {
      @apply mb-[50px] pb-[10px];
    }

    .stick-list {
      @apply mb-[50px] pb-[10px];
    }
  }
}

:deep(.arco-input-wrapper) {
  // background-color: #ffffff;
  @apply bg-white;
}
</style>
