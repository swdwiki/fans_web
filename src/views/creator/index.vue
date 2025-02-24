<template>
  <div class="dashboard flex flex-row justify-between items-start">
    <div class="center">
      <!-- 资料卡片 -->
      <div class="creator_card flex flex-row flex-nowrap justify-start items-center h-[110px] px-5">
        <div class="left">
          <a-avatar :size="70"> <img :src="userInfo.avatar" /></a-avatar>
        </div>
        <div class="right flex flex-col items-start w-full ml-3 justify-between h-[60px]">
          <div class="top text-xl text-black font-bold">{{ userInfo.nickname }}</div>
          <div class="bottom">
            <span class="text-sm text-gray-500"
              ><span class="font-bold mx-1 text-black">{{ createrData.fanCount }}</span
              >粉丝</span
            >
            <a-divider direction="vertical" />
            <span class="text-sm text-gray-500"
              ><span class="font-bold mx-1 text-black">{{ createrData.fanCount }}</span
              >关注</span
            >
            <a-divider direction="vertical" />
            <span class="text-sm text-gray-500"
              >加入轩辕天书<span class="font-bold mx-1 text-black">{{ createrData.regDay }}</span
              >天</span
            >
            <a-divider direction="vertical" />
            <span class="text-sm text-gray-500"
              >已累计签到<span class="font-bold mx-1 text-black">{{ createrData.signCount }}</span
              >天</span
            >
          </div>
        </div>
      </div>
      <!-- 数据概览 -->
      <div class="dashboard-data w-[690px] bg-white mt-5">
        <div
          class="header flex flex-row justify-between items-center px-3 h-[50px] leading-[50px] border-b border-b-gray-200"
        >
          <div class="title text-base font-bold">数据概览</div>
          <!-- <div class="more text-gray-400">查看更多<icon-right /></div> -->
        </div>
        <div class="data-board-list flex flex-row flex-wrap justify-between items-center">
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="总粉丝数"
              :value="createrData.fanCount"
              show-group-separator
            >
            </a-statistic>
          </div>
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="帖子总阅读数"
              :value="createrData.viewCount"
              show-group-separator
            >
            </a-statistic>
          </div>
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="帖子总点赞数"
              :value="createrData.postLikeCount"
              show-group-separator
            >
            </a-statistic>
          </div>
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="尺牍总点赞数"
              :value="createrData.stickLikeCount"
              show-group-separator
            >
            </a-statistic>
          </div>
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="同人作品总阅读数"
              :value="createrData.workViewCount"
              show-group-separator
            >
            </a-statistic>
          </div>
          <div class="data-board">
            <a-statistic
              class="w-full bg-gray-100 hover:bg-gray-200 p-5 rounded-md"
              title="同人作品总点赞数"
              :value="createrData.workLikeCount"
              show-group-separator
            >
            </a-statistic>
          </div>
        </div>
      </div>
      <div class="dashboard-data w-[690px] bg-white mt-5">
        <div
          class="header flex flex-row justify-between items-center px-3 h-[50px] leading-[50px] border-b border-b-gray-200"
        >
          <div class="title text-base font-bold flex flex-row items-center">
            <span>近期发布</span>
            <a-tooltip content="只显示最新10条已通过审核的内容">
              <icon-question-circle class="ml-[5px]" :size="18" />
            </a-tooltip>
          </div>
        </div>
        <div class="mb-5">
          <div class="select block">
            <a-radio-group v-model="selectTypeIndex" type="button" class="my-3 ml-5" @change="selectType">
              <a-radio value="post">帖子</a-radio>
              <a-radio value="stick">尺牍</a-radio>
              <a-radio value="work">同人作品</a-radio>
              <!-- <a-radio value="game">同人游戏</a-radio> -->
            </a-radio-group>
          </div>
          <div class="pb-5">
            <div v-if="selectTypeIndex === 'post'" class="mb-5">
              <template v-if="createrSubmitList.post && createrSubmitList.post.length !== 0">
                <creator-post-card
                  v-for="post in createrSubmitList.post"
                  :key="post.postId"
                  :show-more="false"
                  :post="post"
                ></creator-post-card>
                <router-link
                  :to="{ name: 'PostsCreator', query: { status: 'all' } }"
                  class="block h-[36px] bg-blue-50 w-[90%] mx-auto my-[10px] text-center leading-[36px] hover:bg-blue-100 cursor-pointer"
                >
                  <span>查看更多</span>
                </router-link>
              </template>
              <template v-else>
                <div class="h-[300px] flex flex-col items-center justify-center">
                  <a-empty description="当前未发布帖子"></a-empty>
                </div>
              </template>
            </div>
            <div v-if="selectTypeIndex === 'stick'" class="mb-5">
              <template v-if="createrSubmitList.stick && createrSubmitList.stick.length !== 0">
                <creator-stick-card
                  v-for="stick in createrSubmitList.stick"
                  :key="stick.stickId"
                  :author="stick.author"
                  :content="stick.content"
                  :imgs="stick.imgList"
                  :stick="stick"
                  :theme="stick.theme"
                />
                <router-link
                  :to="{ name: 'PostsCreator', query: { status: 'all' } }"
                  class="block h-[36px] bg-blue-50 w-[90%] mx-auto my-[10px] text-center leading-[36px] hover:bg-blue-100 cursor-pointer"
                >
                  <span>查看更多</span>
                </router-link>
              </template>
              <template v-else>
                <div class="h-[300px] flex flex-col items-center justify-center">
                  <a-empty description="当前未发布尺牍"></a-empty>
                </div>
              </template>
            </div>
            <div v-if="selectTypeIndex === 'work'" class="mb-5 w-full">
              <template v-if="createrSubmitList.work && createrSubmitList.work.length !== 0">
                <div class="flex flex-row flex-wrap justify-center mx-auto">
                  <work-card
                    v-for="work in createrSubmitList.work"
                    :key="work.workId"
                    :show-more="false"
                    :work="work"
                    :show-status="false"
                    :width="180"
                    :height="150"
                  ></work-card>
                </div>
                <router-link
                  :to="{ name: 'WorkCreator', query: { status: 'all' } }"
                  class="block h-[36px] bg-blue-50 w-[90%] mx-auto my-[10px] text-center leading-[36px] hover:bg-blue-100 cursor-pointer"
                >
                  <span>查看更多</span>
                </router-link>
              </template>
              <template v-else>
                <div class="h-[300px] flex flex-col items-center justify-center">
                  <a-empty description="当前未发布同人作品"></a-empty>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right w-[270px]">
      <div class="dashboard-data mb-5">
        <div
          class="header flex flex-row justify-between items-center px-3 h-[50px] leading-[50px] border-b border-b-gray-200"
        >
          <div class="title text-base font-bold">创作活动</div>
          <!-- <div class="more text-gray-400">查看更多<icon-right /></div> -->
        </div>
        <div class="">
          <swiper
            v-if="activitylist && activitylist.length !== 0"
            :modules="options.modules"
            navigation
            effect="fade"
            :autoplay="{ delay: 5000 }"
            :pagination="{ clickable: true }"
            :loop="true"
          >
            <swiper-slide v-for="slide in activitylist" :key="slide.slideId" class="slider-img">
              <a :href="slide.url" target="_blank">
                <img class="slider-img rounded-b-sm" :src="slide.imgUrl" />
              </a>
            </swiper-slide>
          </swiper>
          <div v-else class="h-[152px] flex flex-col justify-center items-center">
            <a-empty description="当前暂无活动"></a-empty>
          </div>
        </div>
      </div>

      <div class="dashboard-data">
        <div
          class="header flex flex-row justify-between items-center px-3 h-[50px] leading-[50px] border-b border-b-gray-200"
        >
          <div class="title text-base font-bold">创作任务</div>
        </div>
        <div class="task-list pb-5">
          <div v-for="task in firstTaskList" :key="task.typeId" class="task-card">
            <a-card :bordered="false" :header-style="TaskCardHeaderStyle" :body-style="TaskCardBodyStyle">
              <template #title>
                <span class="text-sm">{{ task.value }} </span>
              </template>
              <span class="text-xs leading-5 mb-[10px] block">奖励:黑火能量+{{ task.fire }}, 经验+{{ task.exp }}</span>
              <a-button
                v-if="task.expRecord && task.expRecord.length === 0 && task.fireRecord && task.fireRecord.length === 0"
                type="primary"
                size="mini"
                shape="round"
                >{{ task.btnText }}</a-button
              >
              <a-button
                v-if="task.expRecord && task.expRecord.length !== 0 && task.fireRecord && task.fireRecord.length !== 0"
                type="primary"
                size="mini"
                shape="round"
                disabled
                >已完成</a-button
              >
            </a-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/effect-fade';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
// import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store';
import defaultApi from '@/api/modules/default';
import { StickDto } from '@/api/modules/stick';
import { Post } from '@/api/modules/post';

const options = {
  modules: [EffectFade, Autoplay, Pagination],
};

const { userInfo } = useUserStore();

const createrData = ref({
  fanCount: 0,
  viewCount: 0,
  postLikeCount: 0,
  followCount: 0,
  stickLikeCount: 0,
  workLikeCount: 0,
  workViewCount: 0,
  regDay: 0,
  signCount: 0,
});

const TaskCardHeaderStyle = reactive({
  // borderBottom: '0px',
  padding: '0px 5px',
  height: '40px',
});

const TaskCardBodyStyle = reactive({
  padding: '10px 5px',
});

const postList = ref();
const firstTaskList = ref<any>([]);

const selectTypeIndex = ref('post');
const createrSubmitList = ref<{
  stick: Array<StickDto>;
  post: Array<Post>;
  work: Array<any>;
}>({
  stick: [],
  post: [],
  work: [],
});

const activitylist = ref<any>([]);

const selectType = (value: any) => {
  selectTypeIndex.value = value;
};

const fetchCreatorData = () => {
  defaultApi.getCreatorData().then((res) => {
    if (res.code === 0) {
      createrData.value = res.data;
    }
  });
  defaultApi.getCreatorSubmitList().then((res) => {
    if (res.code === 0) {
      createrSubmitList.value = res.data;
    }
  });
  defaultApi.centerFirstTask().then((res) => {
    if (res.code === 0) {
      firstTaskList.value = res.data;
    }
  });
};

onMounted(() => {
  fetchCreatorData();
});
</script>

<style lang="scss" scoped>
.dashboard {
  .dashboard-data {
    @apply bg-white rounded-sm;
  }
  .center {
    .creator_card {
      @apply bg-white w-[690px] rounded-sm;
    }

    .data-board-list {
      @apply px-[10px] py-[20px];
      .data-board {
        width: calc(100% / 3 - 20px);
        @apply m-[10px];
      }
    }
  }
  .right {
    .task-card {
      @apply block mx-auto my-2 px-2 w-11/12 border rounded-sm;
    }
  }
}
</style>
