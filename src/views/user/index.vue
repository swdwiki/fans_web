<template>
  <div class="user-container">
    <div class="user_views flex flex-row flex-nowrap justify-between">
      <div class="flex flex-col sticky top-[80px] h-[700px] sticky top-[80px]">
        <div class="info_area bg-white flex flex-col justify-start items-center py-[15px] px-[10px]">
          <a-avatar :size="64" alt="avatar">
            <img :src="userData.userInfo.avatar" />
          </a-avatar>
          <div class="my-[10px]">
            <span class="nick_name inline-block text-base font-semibold">{{ userData.userInfo.nickname }}</span>
            <span class="nick_name inline-block text-base font-semibold">{{ userData.userInfo.desc }}</span>
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
              @click="$router.push({ name: 'UserSetting' })"
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
                  <a-popconfirm content="是否确定取消关注？">
                    <a-button class="" type="outline" long @click="followAction(userData.userInfo.userId, false)"
                      >取消关注</a-button
                    >
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
              <span class="ml-[5px]">发布文章 {{ userData.count.post }}篇</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-tag size="15" />
              </div>
              <span class="ml-[5px]">发布尺牍 {{ userData.count.stick }}条</span>
            </div>
            <!-- <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-highlight size="15" />
              </div>
              <span class="ml-[5px]">发布同人作品 40篇</span>
            </div> -->
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
              <span class="ml-[5px]">文章被阅读 {{ userData.achieve.postView }}次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">文章被点赞 {{ userData.achieve.postLike }}次</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">尺牍被点赞 {{ userData.achieve.stickLike }}次</span>
            </div>
            <!-- <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">同人作品被阅读 40</span>
            </div>
            <div class="flex flex-row justify-start items-center h-[30px] leading-[30px] my-[5px]">
              <div
                class="bg-blue-200 rounded-[50%] w-[20px] h-[20px] text-blue-400 text-center flex justify-center items-center mr-[5px]"
              >
                <icon-thumb-up-fill size="15" />
              </div>
              <span class="ml-[5px]">同人作品被点赞 40</span>
            </div> -->
          </div>
        </div>
      </div>

      <div ref="creatorListRef" class="list_area bg-white min-h-[1000px] mb-[100px]">
        <a-tabs :active-key="selectModuleKey" @change="tabSelect">
          <a-tab-pane key="post">
            <template #title>
              <span class="h-[60px]">文章</span>
            </template>
            <div class="post-list">
              <post-card v-for="post in postList" :key="post.postId" :post="post" :show-subject="true"></post-card>
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
                      <span class="text-xs text-gray-400">{{ column.postCount }}篇文章</span>
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
              <stick-card
                v-for="stick in stickList"
                :key="stick.stickId"
                :stick="stick"
                :show-more-icon="false"
                :content="stick.content"
                :imgs="stick.imgList"
                :author="stick.author"
              ></stick-card>
            </div>
          </a-tab-pane>
          <!-- <a-tab-pane key="work">
            <template #title> 同人作品 </template>
            <div class="work-list"></div>
          </a-tab-pane> -->
          <a-tab-pane key="follow">
            <template #title> 关注 </template>
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
          </a-tab-pane>
          <!--<a-tab-pane key="like">
            <template #title>
              赞<span class="ml-[10px]">{{ userData.like.all }}</span>
            </template>
         <div class="like-list">
              <div class="p-[15px]">
                <a-radio-group v-model="likeSelectKey" type="button" @change="selectLikeType">
                  <a-radio value="post_like"
                    >文章<span class="ml-[5px]">{{ userData.like.postLike }}</span></a-radio
                  >
                  <a-radio value="stick_like"
                    >尺牍<span class="ml-[5px]">{{ userData.like.stickLike }}</span></a-radio
                  >
                </a-radio-group>
              </div>
              <div class="list">
                <template class=""></template>
              </div>
            </div>
          </a-tab-pane>-->
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

const { userInfo, isLoginStatus } = useUserStore();

const postList = ref<Array<Post>>([]);
const followList = ref<Array<FollowRecord>>([]);
const stickList = ref<Array<StickDto>>([]);
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
    const action = await defaultApi.follow({
      followId,
      status,
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
    pageSize: 10,
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
      }
    });
};

const tabSelect = (key: string | number) => {
  selectModuleKey.value = String(key);
  if (key !== 'like') {
    fetchListData(userPageId.value);
  } else {
    fetchListData(userPageId.value, likeSelectKey.value);
  }
};

const selectLikeType = (value: string) => {
  console.log(value, 'selectLikeType');
  likeSelectKey.value = value;
  fetchListData(userPageId.value, likeSelectKey.value);
};

const fetchData = async (userId: number) => {
  try {
    const { data } = await defaultApi.centerIndexData({ userId });
    userData.value = data;
    console.log(data);
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
  fetchListData(Number(id));
});

watch(isBottom, (newIsBottom) => {
  // newIsBottom如果true
  console.log(newIsBottom, 'newIsBottom');
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
    }
    isBottom.value = false;
  }
});
</script>

<style lang="scss" scoped>
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
