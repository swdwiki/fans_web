<template>
  <div class="user-container">
    <div class="user_views flex flex-row flex-nowrap justify-center">
      <div class="flex flex-col sticky top-[80px] h-[700px] mr-[10px]">
        <div class="info_area bg-white flex flex-col justify-start items-center py-[15px] px-[10px]">
          <a-avatar :size="64" alt="avatar">
            <img :src="userData.userInfo.avatar" />
          </a-avatar>
          <div class="my-[10px] flex flex-col justify-start items-center">
            <span class="nick_name inline-block text-base font-semibold">{{ userData.userInfo.nickname }}</span>
            <span
              v-if="userData.userInfo.desc"
              class="nick_name inline-block text-xs mt-[5px] px-[5px] text-gray-400"
              >{{ userData.userInfo.desc }}</span
            >
          </div>
          <div class="count flex flex-row items-center justify-around w-full">
            <div class="count-card flex flex-col items-center">
              <span class="text-base font-bold">{{ userData.follow.follow }}</span>
              <span class="font-bold text-sm text-gray-400 mt-[5px]">关注</span>
            </div>
            <div class="count-card flex flex-col items-center">
              <span class="text-base font-bold">{{ userData.follow.fan }}</span>
              <span class="font-bold text-sm text-gray-400 mt-[5px]">粉丝</span>
            </div>
          </div>
          <div class="action w-10/12 my-[20px]">
            <a-button
              v-if="userInfo.userId === userData.userInfo.userId"
              type="outline"
              long
              @click="router.push({ name: 'UserSetting' })"
              >设置</a-button
            >
            <template v-else>
              <template v-if="userData.userInfo.userId !== userInfo.userId">
                <template v-if="!userData.userInfo.myFollow">
                  <a-button class="" type="primary" long @click="followAction(userData.userInfo.userId, true)"
                    >关注</a-button
                  >
                </template>
                <template v-else>
                  <a-popconfirm content="是否确定取消关注？" @ok="followAction(userData.userInfo.userId, false)">
                    <a-button class="" type="outline" long>取消关注</a-button>
                  </a-popconfirm>
                </template>
              </template>
            </template>
          </div>
        </div>
        <div class="submit-count bg-white mt-[20px]">
          <span class="h-[40px] leading-[40px] font-semibold text-base px-[10px]">创作数据</span>
          <a-divider margin="0" />
          <div class="px-[15px] py-[10px]">
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-book size="15" />
              </div>
              <span class="ml-[5px]">发布帖子 {{ userData.count.post }}篇</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-tag size="15" />
              </div>
              <span class="ml-[5px]">发布尺牍 {{ userData.count.stick }}条</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-highlight size="15" />
              </div>
              <span class="ml-[5px]">发布同人作品 {{ userData.count.work }} 篇</span>
            </div>
          </div>
        </div>
        <div class="submit-count bg-white mt-[20px]">
          <span class="h-[40px] leading-[40px] font-semibold text-base px-[10px]">创作成就</span>
          <a-divider margin="0" />
          <div class="px-[15px] py-[10px]">
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-eye size="15" />
              </div>
              <span class="ml-[5px]">帖子被阅读 {{ userData.achieve.postView }}次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">帖子被点赞 {{ userData.achieve.postLike }}次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">尺牍被点赞 {{ userData.achieve.stickLike }}次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">同人作品被阅读 {{ userData.achieve.workView }} 次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">同人作品被点赞{{ userData.achieve.workLike }}次</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="creatorListRef" class="list_area bg-white min-h-[1000px] mb-[100px] ml-[10px]">
        <a-tabs :active-key="selectModuleKey" @change="tabSelect">
          <a-tab-pane key="post">
            <template #title>
              <span class="h-[60px]">帖子</span>
            </template>
            <div class="post-list">
              <post-card
                v-for="post in postList"
                :key="post.postId"
                :post="post"
                :show-subject="true"
                :show-more="true"
              ></post-card>
            </div>
          </a-tab-pane>
          <a-tab-pane key="column">
            <template #title> 专栏 </template>
            <div class="column-list">
              <div v-if="columnList && columnList.length !== 0" class="flex flex-row flex-wrap">
                <a-card
                  v-for="column in columnList"
                  :key="column.columnId"
                  style="margin: 20px calc((100% / 3 - 30%) / 2)"
                  hoverable
                  :style="{ width: '30%' }"
                  @click="columnDetail(column.columnId)"
                >
                  <template #cover>
                    <div
                      class="relative"
                      :style="{
                        overflow: 'hidden',
                        height: '120px',
                      }"
                    >
                      <div class="absolute top-3 right-3">
                        <a-tag v-if="column.status === 'auditing'" size="small" color="#ffb400" rounded>审核中</a-tag>
                        <a-tag v-if="column.status === 'injected'" size="small" color="#f53f3f" rounded>未通过</a-tag>
                      </div>
                      <img
                        :style="{ width: '100%', height: '120px' }"
                        alt="dessert"
                        :src="
                          column.cover ||
                          'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp'
                        "
                      />
                    </div>
                  </template>
                  <a-card-meta>
                    <template #title>
                      <div class="flex flex-row flex-nowrap justify-between items-center">
                        <div>
                          <span class="text-base">{{ column.name }}</span>
                        </div>
                      </div>
                    </template>
                    <template #description>
                      <span class="text-xs text-gray-400">{{ column.postCount }}篇帖子</span>
                      <div class="h-5">
                        <p class="h-full text-xs line-clamp-1 mt-2">{{ column.desc }}</p>
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="stick">
            <template #title> 尺牍 </template>
            <div class="stick-list">
              <!-- <stick-card
                v-for="stick in stickList"
                :key="stick.stickId"
                :stick="stick"
                :show-more-icon="false"
                :content="stick.content"
                :imgs="stick.imgList"
                :author="stick.author"
              ></stick-card> -->
              <creator-stick-card
                v-for="stick in stickList"
                :key="stick.stickId"
                :stick="stick"
                :content="stick.content"
                :imgs="stick.imgList"
                :author="stick.author"
                :theme="stick.theme"
                :show-more-btn="false"
              ></creator-stick-card>
            </div>
          </a-tab-pane>
          <a-tab-pane key="work">
            <template #title> 同人作品 </template>
            <div class="work-list flex flex-row flex-wrap mx-auto">
              <work-card
                v-for="work in workList"
                :key="work.workId"
                :work="work"
                :show-more="false"
                :width="210"
                :height="150"
                :show-status="false"
              />
            </div>
            <!-- </div> -->
          </a-tab-pane>
          <a-tab-pane key="follow">
            <template #title> 关注 </template>
            <template v-if="followList && followList.length !== 0">
              <div class="follow-list">
                <div
                  v-for="follow in followList"
                  :key="follow.recordId"
                  class="follow-card flex flex-row justify-between px-[10px] items-center my-[10px]"
                >
                  <div class="left flex flex-row">
                    <a-avatar :size="50"> <img :src="follow.follower.avatar" /> </a-avatar>
                    <div class="flex flex-col justify-center items-start ml-[10px]">
                      <span class="font-bold text-base">{{ follow.follower.nickname }}</span>
                      <span class="text-xs text-gray-400">{{ follow.follower.desc || follow.follower.short }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <a-popconfirm
                      v-if="follow.myFollow && follow.myFollow == 1"
                      content="是否确定取消关注？"
                      @ok="followAction(follow.follower.userId, false)"
                    >
                      <a-button class="">已关注</a-button>
                    </a-popconfirm>
                    <a-button v-else type="primary" class="" @click="followAction(follow.follower.userId, true)"
                      >关注</a-button
                    >
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <a-empty class="mt-[100px]" description="当前暂无关注"></a-empty>
            </template>
          </a-tab-pane>
          <a-tab-pane key="fan">
            <template #title> 粉丝 </template>
            <div class="follow-list">
              <template v-if="fanList && fanList.length !== 0">
                <div
                  v-for="fan in fanList"
                  :key="fan.recordId"
                  class="follow-card flex flex-row justify-between px-[10px] items-center my-[10px]"
                >
                  <div class="left flex flex-row">
                    <a-avatar :size="50"> <img :src="fan.followUser.avatar" /> </a-avatar>
                    <div class="flex flex-col justify-center items-start ml-[10px]">
                      <span class="font-bold text-base">{{ fan.followUser.nickname }}</span>
                      <span class="text-xs text-gray-400">{{ fan.followUser.desc || fan.followUser.short }}</span>
                    </div>
                  </div>
                  <div class="right">
                    <a-popconfirm
                      v-if="fan.myFollow && fan.myFollow == 1"
                      content="是否确定取消关注？"
                      @ok="followAction(fan.followUser.userId, false)"
                    >
                      <a-button class="">已关注</a-button>
                    </a-popconfirm>
                    <a-button v-else type="primary" class="" @click="followAction(fan.followUser.userId, true)"
                      >关注</a-button
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <a-empty class="mt-[100px]" description="当前暂无粉丝"></a-empty>
              </template>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import defaultApi, { FollowRecord } from '@/api/modules/default';
import { StickDto } from '@/api/modules/stick';
import useScroll from '@/hooks/scroll';
import { Post, PostColumn } from '@/api/modules/post';
import { Works } from '@/api/modules/work';

const { userInfo, isLoginStatus } = useUserStore();

const postList = ref<Array<Post>>([]);
const followList = ref<Array<FollowRecord>>([]);
const stickList = ref<Array<StickDto>>([]);
const workList = ref<Array<Works>>([]);
const fanList = ref<Array<FollowRecord>>([]);
const columnList = ref<Array<PostColumn>>([]);
const selectModuleKey = ref('post');
const creatorListRef = ref();
const likeSelectKey = ref('post_like');
const userPageId = ref(0);
const route = useRoute();
const router = useRouter();

const userData = ref<any>({
  userInfo: {},
  count: {
    stick: 0,
    post: 0,
  },
  follow: {
    fan: 0,
    follow: 0,
  },
  achieve: {
    postLike: 0,
    stickLike: 0,
    postView: 0,
  },
  like: {
    postLike: 0,
    stickLike: 0,
  },
});

const { isBottom } = useScroll(creatorListRef.value);
const injectHandle: any = inject('authModal');

const followAction = async (followId: number, status: boolean) => {
  if (isLoginStatus) {
    defaultApi
      .follow({
        followId,
        status,
      })
      .then((res) => {
        if (res.code === 0) {
          // userData.value.userInfo.myFollow = status;
          if (selectModuleKey.value === 'follow') {
            const index = followList.value.findIndex((item: any) => item.follower.userId === followId);
            followList.value[index].myFollow = Number(status);
          } else if (selectModuleKey.value === 'fan') {
            const index = fanList.value.findIndex((item: any) => item.followUser.userId === followId);
            fanList.value[index].myFollow = Number(status);
          }
        }
      });
  } else {
    injectHandle.openAuthModal('login');
  }
};

const listPaginations = reactive<any>({
  post: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  stick: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  work: {
    current: 1,
    pageSize: 12,
    total: 0,
  },
  follow: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  like: {
    current: 1,
    pageSize: 10,
    likeType: 'post',
    total: 0,
  },
  column: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  fan: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
});

const columnDetail = (columnId: number | string) => {
  router.push({
    name: 'UserColumn',
    params: { columnId },
  });
};
const fetchListData = (userId: number, likeType?: string) => {
  defaultApi
    .getCreatorList({
      current: listPaginations[selectModuleKey.value].current,
      pageSize: listPaginations[selectModuleKey.value].pageSize,
      userId,
      likeType,
      type: selectModuleKey.value,
    })
    .then((res: any) => {
      listPaginations[selectModuleKey.value].total = res.data.total;
      if (selectModuleKey.value === 'follow') {
        if (
          followList.value &&
          followList.value.length !== 0 &&
          followList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          followList.value.push(...res.data.list);
        } else {
          followList.value = res.data.list;
        }
      } else if (selectModuleKey.value === 'stick') {
        if (
          stickList.value &&
          stickList.value.length !== 0 &&
          stickList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          stickList.value.push(...res.data.list);
        } else {
          stickList.value = res.data.list;
        }
      } else if (selectModuleKey.value === 'post') {
        if (
          postList.value &&
          postList.value.length !== 0 &&
          postList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          postList.value.push(...res.data.list);
        } else {
          postList.value = res.data.list;
        }
      } else if (selectModuleKey.value === 'column') {
        if (
          columnList.value &&
          columnList.value.length !== 0 &&
          columnList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          columnList.value.push(...res.data.list);
        } else {
          columnList.value = res.data.list;
        }
      } else if (selectModuleKey.value === 'work') {
        if (
          workList.value &&
          workList.value.length !== 0 &&
          workList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          workList.value.push(...res.data.list);
        } else {
          workList.value = res.data.list;
        }
      } else if (selectModuleKey.value === 'fan') {
        if (
          fanList.value &&
          fanList.value.length !== 0 &&
          fanList.value.length < listPaginations[selectModuleKey.value].total
        ) {
          fanList.value.push(...res.data.list);
        } else {
          fanList.value = res.data.list;
        }
      }
    });
};

const tabSelect = (key: string | number) => {
  selectModuleKey.value = String(key);
  listPaginations[key].current = 1;
  const { id } = route.params;
  router.push({
    name: 'UserHome',
    params: { id },
    query: { type: String(key) },
  });
};

const selectLikeType = (value: string) => {
  likeSelectKey.value = value;
  fetchListData(userPageId.value, likeSelectKey.value);
};

const fetchData = async (userId: number) => {
  try {
    const { data } = await defaultApi.centerIndexData({ userId });
    userData.value = data;
  } catch (err) {
    setTimeout(() => {
      router.replace({
        name: 'home',
      });
    }, 0);
  }
};

onMounted(() => {
  const { id } = route.params;
  userPageId.value = Number(id);
  fetchData(Number(id));
});

watch(
  () => route,
  (newRoute, oldRoute) => {
    const { type } = newRoute.query;
    const { id } = newRoute.params;
    if (!type) {
      router.replace({
        name: 'UserHome',
        params: { id },
        query: { type: 'post' },
      });
    } else {
      tabSelect(type as string);
      fetchListData(Number(id));
    }
  },
  { deep: true, immediate: true },
);

watch(isBottom, (newIsBottom) => {
  // newIsBottom如果true
  if (newIsBottom) {
    // 书写触底刷新代码, 记得刷新重置isBottom为false
    if (selectModuleKey.value === 'stick') {
      if (listPaginations[selectModuleKey.value].total > stickList.value.length) {
        listPaginations[selectModuleKey.value].current += 1;
        fetchListData(userPageId.value);
      }
    } else if (selectModuleKey.value === 'follow') {
      if (listPaginations[selectModuleKey.value].total > followList.value.length) {
        listPaginations[selectModuleKey.value].current += 1;
        fetchListData(userPageId.value);
      }
    } else if (selectModuleKey.value === 'post') {
      if (listPaginations[selectModuleKey.value].total > postList.value.length) {
        listPaginations[selectModuleKey.value].current += 1;
        fetchListData(userPageId.value);
      }
    } else if (selectModuleKey.value === 'column') {
      if (listPaginations[selectModuleKey.value].total > columnList.value.length) {
        fetchListData(userPageId.value);
        listPaginations[selectModuleKey.value].current += 1;
      }
    } else if (selectModuleKey.value === 'work') {
      if (listPaginations[selectModuleKey.value].total > workList.value.length) {
        listPaginations[selectModuleKey.value].current += 1;
        fetchListData(userPageId.value);
      }
    }
    isBottom.value = false;
  }
});
</script>

<style lang="scss" scoped>
.user-container {
  @apply mt-[80px] w-[1200px] 2xl:w-[1480px] mx-auto;
}
:deep(.arco-tabs) {
  .arco-tabs-nav-tab {
    @apply h-[50px] leading-[50px]  font-bold text-gray-500;
    .arco-tabs-tab {
      @apply h-[50px] leading-[50px] font-bold text-gray-500;
    }
  }
}
:deep(.arco-tabs-content) {
  @apply pt-0;
}
.user_views {
  .list_area {
    @apply w-[700px];
  }

  .info_area {
    width: 250px;

    .top {
      .nickname {
        display: flex;
        align-items: center;
        margin: 20px 0;
        padding: 0;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
        color: #000;
      }
    }
  }
}
</style>
