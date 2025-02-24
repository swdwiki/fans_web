<template>
  <div class="welfare-box">
    <a-modal
      :visible="showInfoVisible"
      :hide-cancel="true"
      :footer="false"
      width="60%"
      @cancel="showInfoVisible = !showInfoVisible"
    >
      <template #title>
        <span class="text-xl font-bold">兑换规则说明</span>
      </template>
      <div class="notice py-[15px] px-[30px] flex flex-row flex-nowrap justify-between">
        <div class="w-[80%]">
          <span class="text-base font-bold">柒有话说</span>
          <div class="leading-[36px] flex flex-col my-[10px]">
            <span
              >1.一切黑火兑换问题反馈和建议，请在尺牍/帖子社区反馈进行反馈，如涉及个人隐私，请直接微信或QQ联系天书书吏反馈。</span
            >
            <span>2. 所有中奖/兑换道具60个自然日内未提交收件信息视为自动放弃，逾期不补。</span>
            <span
              >3.抽奖/兑换实物商品将于30自然日内发货（特殊奖品/时期除外），物流信息查询会通过站内信和短信发送，请自行前往查询。</span
            >
            <span>4.收件地址请填写详细，地址不详导致无法发货后果自负。</span>
            <span
              >5.当前兑换铺正在装修中，暂不开放黑火兑换，其展示的黑火兑换值和道具也并非正式的数据与道具，仅用于展示。</span
            >
          </div>
        </div>
        <div class="w-[150px]">
          <img class="w-full" :src="getAssetsFile('qi.png', 'img')" />
        </div>
      </div>
    </a-modal>
    <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
      <span class="text-xl font-bold">柒的黑火兑换杂货铺</span>
      <div class="">
        <router-link :to="{ name: 'FireDetail' }" class="text-gray-500 ml-[20px]">黑火能量明细</router-link>
        <!-- <span class="text-gray-500 ml-[20px]" @click="showInfoVisible = !showInfoVisible">兑换规则说明</span> -->
      </div>
    </div>
    <a-divider margin="0" />
    <div class="w-full bg-white">
      <div class="level-card p-[10px]">
        <div
          class="flex flex-row justify-around items-center w-[90%] bg-gray-100 rounded-md py-[20px] mx-auto leading-[30px]"
        >
          <!-- <a-row>
              <a-col :flex="1"> -->
          <router-link :to="{ name: 'FireDetail' }">
            <a-statistic extra="累积黑火能量" :value="fireRecords.fireCount" show-group-separator> </a-statistic>
          </router-link>
          <router-link :to="{ name: 'FireDetail' }">
            <a-statistic extra="当前黑火能量" :value="fireRecords.newFireCount" show-group-separator> </a-statistic>
          </router-link>
          <a-statistic extra="已使用黑火能量" :value="fireRecords.useFireCount" show-group-separator> </a-statistic>
        </div>
        <div class="notice py-[15px] px-[30px] flex flex-row flex-nowrap justify-between">
          <div class="w-[80%]">
            <span class="text-base font-bold">柒有话说</span>
            <div class="leading-[36px] flex flex-col my-[10px]">
              <span
                >1.一切黑火兑换问题反馈和建议，请在尺牍/帖子社区反馈进行反馈，如涉及个人隐私，请直接微信或QQ联系天书书吏反馈。</span
              >
              <span>2. 所有中奖/兑换道具60个自然日内未提交收件信息视为自动放弃，逾期不补。</span>
              <span
                >3.抽奖/兑换实物商品将于30自然日内发货（特殊奖品/时期除外），物流信息查询会通过站内信和短信发送，请自行前往查询。</span
              >
              <span>4.收件地址请填写详细，地址不详导致无法发货后果自负。</span>
              <span
                >5.当前兑换铺正在装修中，暂不开放黑火兑换，其展示的黑火兑换值和道具也并非正式的数据与道具，仅用于展示。</span
              >
            </div>
          </div>
          <div class="w-[150px]">
            <img class="w-full" :src="getAssetsFile('qi.png', 'img')" />
          </div>
        </div>
      </div>
      <!-- <div class="w-[85%] mx-auto py-[20px]">
        <a-table :pagination="false" :data="fireRecords" :summary="0">
          <template #columns>
            <a-table-column align="center" title="行为" data-index="time" :width="200">
              <template #cell="{ record }">
                {{ record.type.value }}
              </template>
            </a-table-column>
            <a-table-column align="center" title="黑火能量变化" data-index="exp" :width="200">
              <template #cell="{ record }"> {{ record.addType === 'add' ? '+' : '-' }}{{ record.fire }} </template>
            </a-table-column>
            <a-table-column align="center" title="时间" data-index="" :width="200">
              <template #cell="{ record }">
                {{ dayjs(record.createdAt).format('YYYY年MM月DD日 HH:mm:ss') }}
              </template>
            </a-table-column>
          </template>
        </a-table>
        <router-link
          :to="{ name: 'FireDetail' }"
          class="block h-[40px] leading-[40px] text-center w-full bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer border-x border-x-gray-200 border-b border-b-gray-200"
        >
          仅展示最新10条记录，点击查看更多
        </router-link>
      </div> -->
    </div>
    <div class="shop-list my-[20px] bg-white">
      <div class="head h-[60px] leading-[60px] px-[20px]">
        <span class="text-xl font-bold">实物兑换</span>
      </div>
      <a-divider margin="0" />
      <div class="list p-[30px] flex flex-row flex-wrap items-center">
        <template v-if="welfareList && welfareList.length !== 0">
          <div
            v-for="welfare in welfareList"
            :key="welfare.welfareId"
            class="border border-gray-100 w-[202px] m-[10px]"
          >
            <div class="w-[200px] h-[160px]">
              <img class="w-full h-full object-cover" :src="welfare.cover" />
            </div>
            <div class="bg-white p-[10px]">
              <span class="font-bold text-[15px] block mb-[10px]">{{ welfare.name }}</span>
              <a-tag size="small" color="#ff7d00">{{ welfare.content }}</a-tag>
              <div class="my-[10px] flex flex-row justify-between items-center flex-nowrap">
                <span
                  ><icon-font class="mr-[3px]" type="swd-jiarehuoyan" :size="15" />
                  <span class="text-blue-500 font-semibold">{{
                    welfare.firePrice >= 10000
                      ? (welfare.firePrice / 10000).toFixed(1) + '万'
                      : welfare.firePrice >= 1000 && welfare.firePrice < 10000
                      ? (welfare.firePrice / 1000).toFixed(1) + 'K'
                      : welfare.firePrice
                  }}</span></span
                >
                <span class="text-xs">剩余{{ welfare.count }}件</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <a-alert banner center>
            <span class="text-center">柒的黑火兑换杂货铺还在装修中，各位大眼蛙敬请期待哟！</span></a-alert
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';
import { getAssetsFile } from '@/utils/format';
import defaultApi from '@/api/modules/default';
import dayjs from '@/utils/dayjs';

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });
const welfareList = ref<any>([]);
const showInfoVisible = ref(false);

const fireRecords = ref({
  fireCount: 0,
  newFireCount: 0,
  useFireCount: 0,
});

const fetchData = async () => {
  const res = await defaultApi.getFireCount();
  if (res.code === 0) {
    fireRecords.value = res.data;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.welfare-box {
  // @apply mt-[60px];
}
</style>
