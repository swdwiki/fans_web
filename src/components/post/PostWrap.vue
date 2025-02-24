<template>
  <div class="index-posts-wrap">
    <div class="left">
      <div class="post-nav bg-white">
        <nav class="post-nav-wrap">
          <div :class="['nav-item-wrap', selectSubjectId === -1 ? 'nav-item-wrap-selected' : '']">
            <div class="nav-item-content" @click="actionChangeSubject(-1)">全部</div>
          </div>
          <div
            v-for="subject in subjectList"
            :key="subject.subjectId"
            :class="['nav-item-wrap', selectSubjectId === subject.subjectId ? 'nav-item-wrap-selected' : '']"
          >
            <div class="nav-item-content" @click="actionChangeSubject(subject.subjectId)">
              {{ subject.title }}
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="right ml-5 w-[750px]">
      <div class="header bg-white">
        <div class="list-header border-b-gray-600 flex flex-row flex-nowrap justify-between items-center">
          <div class="w-1/2 flex flex-row justify-start">
            <a-menu mode="horizontal" :selected-keys="[activeIndex]">
              <a-menu-item key="submit">最新发布</a-menu-item>
              <!-- <a-menu-item key="reply">最新回复</a-menu-item> -->
            </a-menu>
          </div>
          <div v-if="selectSubjectId !== -1" class="w-1/2 flex flex-row-reverse pr-5">
            <a-select
              v-model="selectPlateId"
              :style="{ width: '200px' }"
              placeholder="请选择分类"
              size="small"
              @change="actionChangePlate"
            >
              <a-option :value="0" label="全部" />
              <a-option v-for="plate in platesList" :key="plate.plateId" :label="plate.name" :value="plate.plateId" />
            </a-select>
          </div>
        </div>
      </div>
      <div class="list bg-white">
        <div v-if="postList && postList.length !== 0" ref="postListRef" v-loading="loading" class="post-list">
          <post-card v-for="post in postList" :key="post.postId" :post="post" :show-more="true" :show-subject="true" />
        </div>
        <div v-else>
          <div class="py-[100px]">
            <a-empty description="暂无帖子"></a-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import postApi, { PostSubject, PostPlate, Post } from '@/api/modules/post';
import useLoading from '@/hooks/loading';
import useScroll from '@/hooks/scroll';
import { Pagination } from '@/utils/global';

const selectSubjectId = ref<number>(-1);
const selectPlateId = ref<number>(0);
const activeIndex = ref('submit');
const subjectList = ref<Array<PostSubject>>([]);
const platesList = ref<Array<PostPlate>>([]);
const postList = ref<Array<Post>>([]);
const postListRef = ref<any>();

const { loading, setLoading } = useLoading();
const { isBottom } = useScroll(postListRef.value); // 此处可传入滚动的dom实例
const postListQuery = reactive<{ plateId: number | undefined; subjectId: number | undefined }>({
  plateId: undefined,
  subjectId: undefined,
});

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const indexPostPagination = reactive({
  ...basePagination,
});

const fetchSubjectsData = async () => {
  setLoading(true);
  try {
    const { data } = await postApi.getSubjectList();
    subjectList.value = data;
    platesList.value = subjectList.value[0].plates;
    setLoading(false);
  } catch (err) {
    console.log(err);
    setLoading(false);
  }
};

const fetchData = async (params = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await postApi.getPostList({
      ...params,
      ...postListQuery,
    });
    indexPostPagination.current = Number(params.current);
    indexPostPagination.total = Number(data.total);
    postList.value.push(...data.list);
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const refreshList = () => {
  postList.value = [];
  indexPostPagination.current = 1;
  fetchData({ ...indexPostPagination });
};

const actionChangeSubject = (subjectId: number | string) => {
  selectSubjectId.value = Number(subjectId);
  if (Number(subjectId) !== -1) {
    const subjectIndex = subjectList.value.findIndex((subject: any) => {
      return subject.subjectId === subjectId;
    });
    platesList.value = subjectList.value[subjectIndex].plates;
    selectPlateId.value = 0;
    postListQuery.subjectId = Number(subjectId);
    postListQuery.plateId = undefined;
  } else {
    platesList.value = [];
    selectPlateId.value = 0;
    postListQuery.subjectId = undefined;
    postListQuery.plateId = undefined;
  }
  refreshList();
};

const actionChangePlate = (key: any) => {
  selectPlateId.value = key;
  if (key === 0) {
    postListQuery.plateId = undefined;
  } else {
    postListQuery.plateId = key;
  }
  refreshList();
};

watch(isBottom, (newIsBottom) => {
  // newIsBottom如果true
  if (newIsBottom) {
    // 书写触底刷新代码, 记得刷新重置isBottom为false
    if (indexPostPagination.total > postList.value.length) {
      indexPostPagination.current += 1;
      fetchData({
        ...indexPostPagination,
      });
      isBottom.value = false;
    }
  }
});

onMounted(async () => {
  fetchSubjectsData();
  fetchData({ ...indexPostPagination });
  // selectSubjectId.value = Number(subjectList.value[0].subjectId);
});
</script>

<style lang="scss" scoped>
.index-posts-wrap {
  @apply mb-[30px] flex flex-row;
}
.post-nav {
  width: 150px;
  // position: sticky;
  // top: 80px;
  height: fit-content;
  border-radius: 4px;
}

.post-nav-wrap {
  min-width: 150px;
  box-sizing: border-box;
  @apply p-[8px] text-[15px];

  .nav-item-wrap {
    margin: 10px 0;
    height: 50px;

    @apply flex flex-col text-center hover:bg-gray-100 hover:rounded-md hover:text-blue-500 hover:font-bold;
    .nav-item-content {
      line-height: 50px;
      cursor: pointer;
      // display: flex;
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
    }
  }
  .nav-item-wrap-selected {
    @apply bg-blue-100 rounded-md text-blue-500 font-bold hover:bg-blue-100;
  }
}
</style>
