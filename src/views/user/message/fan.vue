<template>
  <div class="message-container">
    <div class="message-box">
      <template v-if="fans && fans.length !== 0">
        <div class="p-[10px] flex flex-row flex-wrap">
          <div v-for="item in fans" :key="item" class="fan-card">
            <div class="flex flex-row justify-start items-center">
              <a-avatar :size="50"> <img :src="item.followUser.avatar" /> </a-avatar>
              <div class="info flex flex-col justify-center items-start ml-[10px]">
                <div class="name-line flex flex-row justify-start items-center">
                  <router-link :to="`/u/${item.followUser.userId}`" class="text-base font-bold">{{
                    item.followUser.nickname
                  }}</router-link>
                  <span class="text-sm text-gray-600 ml-[20px]">关注了你</span>
                </div>
                <span class="mt-[5px] text-gray-500">{{ dayjs(item.createdAt).fromNow() }}</span>
              </div>
            </div>
            <a-button v-if="!item.followUser.myFollow" type="outline" @click="follow(item.followUser.userId, true)"
              >关注</a-button
            >
            <a-popconfirm content="是否取消关注？" @before-ok="follow(item.followUser.userId, false)">
              <a-button v-if="item.followUser.myFollow" type="outline" status="success">
                <icon-swap />
                互相关注
              </a-button>
            </a-popconfirm>
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
        <a-empty class="mt-[200px]" description="当前暂无粉丝" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { template } from 'lodash';
import dayjs from '@/utils/dayjs';
import useUserStore from '@/store/user/user';
import defaultApi from '@/api/modules/default';
import { Pagination } from '@/utils/global';

const { userInfo } = useUserStore();

const fans = ref([]);

const basePagination: Pagination = {
  current: 1,
  pageSize: 20,
  total: 0,
};

const injectHandle: any = inject('topHeader');

const readFanRecord = () => {
  const recordIds = [];
  fans.value.forEach((fan: any) => {
    if (!fan.readStatus) {
      recordIds.push(fan.recordId);
    }
  });
  defaultApi
    .sendReadFanRecord({
      recordIds,
    })
    .then((res) => {
      if (res.code === 0) {
        console.log('已读消息');
      }
    });
};

const fetchData = () => {
  defaultApi.getFansList({ ...basePagination }).then((res) => {
    if (res.code === 0) {
      fans.value = res.data.list;
      basePagination.total = res.data.total;
      readFanRecord();
      injectHandle.getCommentCount();
    }
  });
};

const pageChange = (current: number) => {
  basePagination.current = current;
  fetchData();
};

const follow = (userId, bool) => {
  defaultApi.follow({ followId: userId, status: bool }).then((res) => {
    if (res.code === 0) {
      fetchData();
    }
  });
};

onMounted(() => {
  fetchData();
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
    @apply w-[960px] 2xl:w-[1200px]  bg-white min-h-[500px] max-h-[1100px] mx-auto mt-[150px];
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
</style>
