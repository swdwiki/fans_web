<template>
  <div class="message-container">
    <div :class="['message-box']">
      <div class="child-top-nav">
        <router-link
          v-for="(nav, index) in navList"
          :key="index"
          :to="{ name: 'LikeMessage', query: { type: nav.value } }"
          :class="[selectNav === nav.value ? 'nav-selected' : '', 'child-nav']"
          @click="changeSelectNav(nav.value)"
          >{{ nav.name }}</router-link
        >
      </div>
      <template v-if="likeList && likeList.length !== 0">
        <div v-for="like in likeList" :key="like.recordId" :loading="loading">
          <div class="like-card h-[76px]">
            <div class="flex flex-row justify-start items-center">
              <a-avatar :size="50"> <img :src="like.likeUser.avatar" /> </a-avatar>
              <div class="info flex flex-col justify-center items-start ml-[10px]">
                <div class="name-line flex flex-row justify-start items-center">
                  <router-link
                    v-if="like.likeUser && like.likeUser.userId"
                    :to="`/u/${like.likeUser.userId}`"
                    class="text-base font-bold"
                    >{{ like.likeUser.nickname }}</router-link
                  >
                  <div class="">
                    <span class="text-sm text-gray-600 ml-[10px]"
                      >赞了你的{{ navList[navList.findIndex((nav) => nav.value === selectNav)].name }}</span
                    >
                    <router-link
                      v-if="selectNav === 'post' && like.post && like.post.postId"
                      class="ml-[5px] font-bold"
                      :to="{ name: 'PostDetail', params: { postId: like.post.postId } }"
                      >《{{ like.post.title }}》</router-link
                    >
                    <router-link
                      v-if="selectNav === 'stick' && like.stick && like.stick.stickId"
                      class="ml-[5px] font-bold"
                      :to="{ name: 'stickDetail', params: { id: like.stick.stickId } }"
                      >{{ like.stick.content.substring(0, 10) }}
                      {{ like.stick.content.length > 10 ? '...' : '' }}</router-link
                    >
                    <router-link
                      v-if="selectNav === 'work' && like.work && like.work.workId"
                      class="ml-[5px] font-bold"
                      :to="{ name: 'workDetail', params: { id: like.work.workId } }"
                      >《{{ like.work.title }}》</router-link
                    >
                  </div>
                </div>
                <span class="mt-5px text-gray-500">{{ dayjs(like.createdAt).fromNow() }}</span>
              </div>
            </div>
            <img
              v-if="selectNav === 'post' && like.post && like.post.cover"
              :src="like.post.cover"
              class="w-[76px] h-[76px]"
            />
            <img
              v-if="selectNav === 'stick' && like.stick && like.stick.imgList && like.stick.imgList.length !== 0"
              :src="like.stick.imgList[0].url"
              class="w-[76px] h-[76px]"
            />
            <img
              v-if="selectNav === 'work' && like.work && like.work.cover"
              :src="like.work.cover"
              class="w-[76px] h-[76px]"
            />
          </div>
        </div>
        <div
          v-if="basePagination.total > basePagination.pageSize"
          class="mx-auto w-full flex flex-row justify-center items-center"
        >
          <a-pagination
            class="my-[20px]"
            :total="basePagination.total"
            :current="basePagination.current"
            :page-size="basePagination.pageSize"
            @change="pageChange"
          />
        </div>
      </template>
      <template v-else>
        <a-empty class="mt-[200px]" description="当前暂无点赞" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultApi from '@/api/modules/default';
import useUserStore from '@/store/user/user';
import { Pagination } from '@/utils/global';
import dayjs from '@/utils/dayjs';
import useLoading from '@/hooks/loading';

// 在这里要对当前访问的内容进行已读传送，提示到 sse

const { userInfo, isLoginStatus } = useUserStore();
const { loading, setLoading } = useLoading();
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

const likeList = ref<any>([]);
const route = useRoute();

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const injectHandle: any = inject('topHeader');

// 发送已读消息
const readLikeRecord = (type: string) => {
  const recordIds = [];
  likeList.value.forEach((like: any) => {
    if (!like.readStatus) {
      recordIds.push(like.recordId);
    }
  });
  defaultApi
    .sendReadLikeRecord({
      type,
      recordIds,
    })
    .then((res) => {
      if (res.code === 0) {
        console.log('已读消息');
      }
    });
};

const fetchData = () => {
  setLoading(true);
  defaultApi
    .getLikeList({ ...basePagination, type: selectNav.value })
    .then((res) => {
      if (res.code === 0) {
        likeList.value = res.data.list;
        basePagination.total = res.data.total;
        readLikeRecord(selectNav.value);
        injectHandle.getCommentCount();
      }
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

const pageChange = (current: number) => {
  basePagination.current = current;
  fetchData();
};

const changeSelectNav = (value: string) => {
  selectNav.value = value;
  basePagination.current = 1;
  fetchData();
};

onMounted(() => {
  const { type } = route.query;
  if (type) {
    changeSelectNav(type as string);
  } else {
    changeSelectNav('post');
  }
});
</script>

<style lang="scss" scoped>
.message-container {
  .message-box {
    @apply w-[960px] 2xl:w-[1200px]  bg-white min-h-[1300px] mx-auto mt-[150px];
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
