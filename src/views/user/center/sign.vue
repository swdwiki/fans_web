<template>
  <div class="sign-box">
    <a-modal v-model:visible="showSupSignBox" @before-ok="supSignin" @cancel="showSupSignBox = false">
      <template #title>补签</template>
      <div>是否消耗一张补签卡进行补签？</div>
    </a-modal>
    <a-modal v-model:visible="showSignContentBox" :footer="false">
      <template #title>签到规则说明</template>
      <div>
        <span>
          1、签到奖励：同一帐号每日可签到1次，每日完成当天签到任务，可获得10点黑火能量奖励和10点经验值奖励；<br />
          2、黑火能力仅可用于在黑火兑换中使用，不可转赠或变现；<br />
          3、您获得的黑火能量无期限限制使用。</span
        >
      </div>
    </a-modal>
    <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
      <span class="text-xl font-bold">每日签到</span>
      <span class="text-gray-500" @click="showSignContentBox = true">签到规则说明</span>
    </div>
    <a-divider margin="0" />
    <div class="calender-box bg-white flex flex-row justify-between p-[32px]">
      <div class="content-left w-[560px]">
        <div class="signin-count flex flex-row p-[20px] bg-gray-100 w-[560px] justify-around items-center">
          <!-- <div class="flex flex-col h-[60px]">
            <span class="h-[40px] leading-[40px] text-3xl font-bold">1</span>
            <span class="h-[20px] leading-[20px] text-gray-500">最长连续签到天数</span>
          </div> -->
          <div class="flex flex-col h-[60px]">
            <span class="h-[40px] leading-[40px] text-3xl font-bold">{{ centerCount.signinday }}</span>
            <span class="h-[20px] leading-[20px] text-gray-500">累计签到天数</span>
          </div>
          <div class="flex flex-col h-[60px]">
            <template v-if="centerCount.expCount >= 10000">
              <a-trigger show-arrow>
                <span class="h-[40px] leading-[40px] text-3xl font-bold">{{
                  centerCount.expCount > 10000 && centerCount.expCount < 999999
                    ? (centerCount.expCount / 1000).toFixed(1) + 'K'
                    : (centerCount.expCount / 10000).toFixed(1) + 'W'
                }}</span>
                <template #content>
                  <div class="bg-white p-[10px] leading-[28px] shadow-[0_15px_15px_-10px_rgba(0,0,0,0.3)] text-xs">
                    {{ centerCount.expCount }} 经验值
                  </div>
                </template>
              </a-trigger>
            </template>
            <template v-else>
              <span class="h-[40px] leading-[40px] text-3xl font-bold">{{ centerCount.expCount }}</span>
            </template>
            <span class="h-[20px] leading-[20px] text-gray-500">当前经验值</span>
          </div>
          <div class="flex flex-col h-[60px]">
            <template v-if="centerCount.fireCount >= 10000">
              <a-trigger show-arrow>
                <span class="h-[40px] leading-[40px] text-3xl font-bold">{{
                  centerCount.fireCount > 10000 && centerCount.fireCount < 999999
                    ? (centerCount.fireCount / 1000).toFixed(1) + 'K'
                    : (centerCount.fireCount / 10000).toFixed(1) + 'W'
                }}</span>
                <template #content>
                  <div class="bg-white p-[10px] leading-[28px] shadow-[0_15px_15px_-10px_rgba(0,0,0,0.3)] text-xs">
                    {{ centerCount.fireCount }} 黑火能量
                  </div>
                </template>
              </a-trigger>
            </template>
            <template v-else>
              <span class="h-[40px] leading-[40px] text-3xl font-bold">{{ centerCount.fireCount }}</span>
            </template>

            <span class="h-[20px] leading-[20px] text-gray-500"
              >当前黑火能量
              <a-trigger show-arrow>
                <icon-question-circle class="ml-[3px]" />
                <template #content>
                  <div
                    class="bg-white w-[200px] p-[10px] leading-[28px] shadow-[0_15px_15px_-10px_rgba(0,0,0,0.3)] text-xs"
                  >
                    黑火能量是轩辕天书社区的通用积分，大眼蛙可通过完成各种任务获得，无使用期限限制。
                  </div>
                </template>
              </a-trigger>
            </span>
          </div>
        </div>
        <div class="calender-box mt-[20px] w-[560px]">
          <div class="header mb-[20px] flex flex-row justify-between items-center">
            <div class="select-year-month flex flex-row justify-center items-center">
              <div
                class="mr-[10px]"
                :class="[selectMonthIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer']"
                @click="actionMonth(-1)"
              >
                <icon-caret-left :size="24" />
              </div>
              <span class="text-xl text-black font-bold">{{
                dayjs(selectMonthList[selectMonthIndex]).format('YYYY年M月')
              }}</span>
              <div
                class="ml-[10px]"
                :class="[
                  selectMonthIndex === selectMonthList.length - 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 cursor-pointer',
                ]"
                @click="actionMonth(1)"
              >
                <icon-caret-right :size="24" />
              </div>
            </div>
            <div class="">
              <span class="text-gray-400 font-bold text-base">补签卡：{{ centerCount.signcard }}张</span>
            </div>
          </div>
          <div class="dates">
            <div class="week flex flex-row flex-nowrap w-full">
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm ml-0 mr-[6px] my-[8px]">星期一</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mx-[6px] my-[8px]">星期二</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mx-[6px] my-[8px]">星期三</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mx-[6px] my-[8px]">星期四</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mx-[6px] my-[8px]">星期五</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mx-[6px] my-[8px]">星期六</span>
              <span class="text-center w-[68px] h-[30px] leading-[30px] text-sm mr-0 ml-[6px] my-[8px]">星期日</span>
            </div>
            <div v-loading="loading" class="date flex flex-row flex-wrap w-full">
              <template v-for="date in calenderList" :key="date">
                <div
                  v-if="date.isShow"
                  class="relative text-center w-[68px] h-[68px] my-[8px] flex flex-col justify-center items-center"
                  :class="[
                    date.week % 7 == 6 ? 'mr-0 ml-[6px]' : date.week % 7 === 0 ? 'ml-0 mr-[6px]' : 'mx-[6px]',
                    date.record.sign ? 'bg-blue-100' : 'bg-gray-50',
                  ]"
                  @click="selectDate(date)"
                >
                  <icon-check v-if="date.record.sign" class="absolute top-0 right-0" />
                  <span
                    class="text-xl font-bold text-black w-[32px] h-[32px]"
                    :class="[
                      dayjs(new Date()).format('YYYY-MM-DD') === date.date
                        ? 'rounded-[50%] bg-blue-500 text-white'
                        : '',
                    ]"
                    >{{ dayjs(date.day).date() }}</span
                  >
                  <span
                    class="text-xs font-bold"
                    :class="[
                      date.record.sign || dayjs(new Date()).format('YYYY-MM-DD') > date.date
                        ? 'text-blue-600'
                        : 'text-gray-600',
                    ]"
                    >{{
                      date.record.sign || dayjs(new Date()).format('YYYY-MM-DD') <= date.date ? '+10' : '可补签'
                    }}</span
                  >
                </div>
                <div
                  v-else
                  class="text-center w-[68px] h-[68px] my-[8px] bg-white"
                  :class="[date.week % 7 === 0 ? 'ml-0 mr-[6px]' : date.week % 7 === 6 ? 'mr-0 ml-[6px]' : 'mx-[6px]']"
                ></div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right w-[280px] mx-auto">
        <div
          class="mt-[20px] w-[280px] h-[56px] rounded-sm text-base font-bold text-center shadow-[0_0_16px_rgba(30,128,255,.24)] cursor-pointer flex flex-col justify-center items-center"
          :class="[signinStatus ? 'bg-blue-200 text-blue-600' : 'bg-blue-500 text-white']"
          @click="signin(dayjs().format('YYYY-MM-DD'))"
        >
          <span class=""> {{ signinStatus ? '今日已签到' : '立即签到' }}</span>
          <span v-if="!signinStatus" class="text-xs flex flex-row justify-center items-center w-full">
            <span class="mx-[5px]">黑火能量 +50</span>
            <span class="mx-[5px]">经验值 +10</span>
          </span>
        </div>
        <a-divider />
        <div class="sign_cover">
          <!-- <a-button v-if="showDrawCard" type="primary">每日炼妖壶吉签抽签</a-button> -->
          <a-card hoverable>
            <template #cover>
              <div class="h-full w-full">
                <img
                  class="object-cover"
                  :style="{ width: '100%', transform: 'translateY(-20px)' }"
                  alt="dessert"
                  :src="signinLine && signinLine.cover ? signinLine.cover : getAssetsFile('signin_bg.jpg', 'img')"
                />
              </div>
            </template>
            <a-card-meta>
              <template #title>
                <span class="leading-[40px] text-base h-[40px]">
                  <span class="mr-[10px]">{{ dayjs().format('YYYY年M月D日') }}</span>
                  <span class="mr-[10px]">{{ calendar(new Date().toString()) }}</span>
                  <!-- <span>{{ isSpecialDay(dayjs().format('YYYY-MM-DD')) }}</span> -->
                </span>
              </template>
              <template #description>
                <div v-if="signinLine" class="flex flex-col">
                  <span class="left text-sm leading-[26px]">{{
                    (signinLine && signinLine.content) || '剑的传说 直到永恒'
                  }}</span>
                  <span class="text-right mt-[10px] font-semibold">{{ signinLine.linesFrom }}</span>
                </div>
                <div v-else>
                  <span class="left text-base font-bold leading-[26px]"> 剑的传说 直到永恒 </span>
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import weekday from 'dayjs/plugin/weekday';
import { Message } from '@arco-design/web-vue';
import dayjs from '@/utils/dayjs';
import defaultApi from '@/api/modules/default';
import { calendar, getAssetsFile } from '@/utils/format';
import useLoading from '@/hooks/loading';

const centerCount = ref({
  signinday: 0,
  fireCount: 0,
  expCount: 0,
  level: {},
  signcard: 0,
});

const { loading, setLoading } = useLoading();

dayjs.extend(weekday);

const signinStatus = ref(false);
const selectMonthList = ref<Array<string>>([]);
const selectMonthIndex = ref(1);
const calenderList = ref<Array<any>>();
const showDrawCard = ref(false);
const showSupSignBox = ref(false);
const selectDay = ref('');
const showSignContentBox = ref(false);
const signinLine = ref<any>({
  recordId: 1,
  content: '',
  linesFrom: '',
  isAnniversary: false,
  anniversary: null,
  cover: '',
  date: '',
});

const fetchData = async () => {
  setLoading(true);
  try {
    const { data } = await defaultApi.getSigninList({
      month: selectMonthList.value[selectMonthIndex.value],
    });
    calenderList.value = data.monthlist;
    signinStatus.value = data.todaySign;
    setLoading(false);
  } catch (err) {
    console.log(err);
    // setLoading(false);
  }
};

const fetchCountData = async () => {
  try {
    const { data } = await defaultApi.getCenterCount();
    centerCount.value = data;
    signinLine.value = data.dailyLine;
  } catch (err) {
    console.log(err);
  }
};

const actionMonth = (num: number) => {
  if (num === -1) {
    if (selectMonthIndex.value > 0) {
      selectMonthIndex.value += num;
    } else {
      selectMonthIndex.value = 0;
    }
  } else if (num === 1) {
    if (selectMonthIndex.value < selectMonthList.value.length - 1) {
      selectMonthIndex.value += num;
    } else {
      selectMonthIndex.value = selectMonthList.value.length - 1;
    }
  }
  // calenderList.value = getMonth(selectMonthList.value[selectMonthIndex.value]);
  fetchData();
};

const supSignin = (done: any) => {
  defaultApi
    .supSignin({ signinTime: selectDay.value })
    .then((res) => {
      if (res.code === 0) {
        Message.success('签到成功');
        fetchData();
        fetchCountData();
        done(true);
      } else {
        Message.error(res.message);
        done(false);
      }
    })
    .catch((err) => {
      done(false);
      // Message.error(err.message);
    });
};

const signin = (date: string) => {
  defaultApi
    .signin({ signinTime: date })
    .then((res) => {
      if (res.code === 0) {
        Message.success('签到成功');
        fetchData();
        fetchCountData();
      } else {
        Message.error(res.message);
      }
    })
    .catch((err) => {
      Message.error(err.message);
    });
};

const selectDate = (date: any) => {
  selectDay.value = date.date;
  if (date.record.sign) {
    Message.info('你已经签到过了');
  } else {
    const now = dayjs(new Date()).format('YYYY-MM-DD');
    if (now < date.date) {
      Message.info('未到签到时间，请勿提前签到');
    } else if (now > date.date) {
      showSupSignBox.value = true;
    } else {
      signin(date.date);
    }
  }
};

onMounted(() => {
  selectMonthList.value = [dayjs().subtract(1, 'month').format('YYYY-MM'), dayjs().format('YYYY-MM')];
  fetchData();
  fetchCountData();
});
</script>

<style lang="scss" scoped>
.sign-box {
  // @apply mt-[60px];
}
</style>
