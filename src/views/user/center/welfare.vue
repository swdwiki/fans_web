<template>
  <div class="welfare">
    <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
      <span class="text-xl font-bold">柒的黑火兑换杂货铺</span>
      <span class="text-gray-500">兑换说明</span>
    </div>
    <a-divider margin="0" />
    <div class="w-full bg-white">
      <a-alert banner center>
        <span class="text-center">柒的黑火兑换杂货铺还在装修中，各位大眼蛙敬请期待哟！</span></a-alert
      >
      <div class="notice py-[15px] px-[30px] flex flex-row flex-nowrap justify-between">
        <div class="w-[80%]">
          <span class="text-base font-bold">柒有话说</span>
          <div class="leading-[36px] flex flex-col my-[10px]">
            <span
              >1.一切黑火兑换问题反馈和建议，请在尺牍反馈处进行反馈，如有个人隐私情况，请直接微信或QQ联系天书书吏反馈。</span
            >
            <span>2. 所有中奖/兑换道具30个自然日内未提交收件信息视为自动放弃，逾期不补。</span>
            <span
              >3.抽奖/兑换实物商品将于30自然日内发货（特殊时期除外），物流信息查询会通过站内信和短信发送，请自行前往查询。</span
            >
            <span>4.收件地址请填写详细，地址不详导致无法发货后果自负。</span>
            <span>5.测试阶段不开放黑火兑换，其展示的黑火兑换值和道具也并非正式版的数据与道具，仅用于展示。</span>
          </div>
        </div>
        <div class="w-[150px]">
          <img class="w-full" src="https://files.swdwiki.com/tos-cn-i-8vrofckkw9/short/qi.png" />
        </div>
      </div>
    </div>
    <div class="shop-list my-[20px] bg-white">
      <div class="head h-[60px] leading-[60px] px-[20px]">
        <span class="text-xl font-bold">实物兑换</span>
      </div>
      <a-divider margin="0" />
      <div class="list p-[30px] flex flex-row flex-wrap items-center">
        <div v-for="welfare in welfareList" :key="welfare.welfareId" class="border border-gray-100 w-[202px] m-[10px]">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@arco-design/web-vue';
import config from '@/config/config';

const IconFont = Icon.addFromIconFontCn({ src: config.iconFontUrl });
const welfareList = ref([
  {
    welfareId: 1,
    name: '拓跋玉儿兵人可动艺体',
    cover: 'http://files.swdwiki.com/tos-cn-i-8vrofckkw9/shop/swd3e_yuer_shouban.jpg',
    firePrice: 1000000,
    count: 2,
    content: '胡玩出品',
  },
  {
    welfareId: 2,
    name: '轩辕剑叁NS实体标准版',
    cover: 'http://files.swdwiki.com/tos-cn-i-8vrofckkw9/shop/swd3_ns_custom.jpg',
    firePrice: 300000,
    count: 3,
    content: 'NS欧版实体版',
  },
  {
    welfareId: 3,
    name: '轩辕剑叁NS实体典藏版',
    cover: 'http://files.swdwiki.com/tos-cn-i-8vrofckkw9/shop/swd3_ns_full.jpg',
    firePrice: 600000,
    count: 1,
    content: 'NS欧版实体版',
  },
]);
</script>

<style lang="scss" scoped>
.calender-box {
}
</style>
