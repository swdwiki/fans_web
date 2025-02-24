<template>
  <div class="level-box">
    <div>
      <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
        <span class="text-xl font-bold">成长等级</span>
        <div>
          <!-- <span class="text-gray-500">黑火</span> -->
          <router-link :to="{ name: 'ScoreDetail' }" class="text-gray-500">经验明细</router-link>
        </div>
      </div>
      <a-divider margin="0" />
      <div class="bg-white">
        <div v-if="myLevel" class="level-card p-[10px]">
          <div
            class="flex flex-row justify-around items-center w-[90%] bg-gray-100 rounded-md py-[20px] mx-auto leading-[30px]"
          >
            <!-- <a-row>
              <a-col :flex="1"> -->
            <a-statistic extra="当前等级" :value="myLevel.level" show-group-separator>
              <template #prefix> LV. </template>
              <template #suffix>
                <span class="ml-[10px]">{{ myLevel.content }}</span>
              </template>
            </a-statistic>
            <!-- </a-col>
              <a-col :flex="1"> -->
            <a-statistic
              class="text-gray-500 cursor-pointer"
              extra="当前经验值"
              :value="myLevel.exp"
              show-group-separator
              @click="gotoPage('ScoreDetail')"
            >
            </a-statistic>
            <!-- </a-col>
              <a-col :flex="1"> -->
            <a-statistic
              extra="距离下一次升级还有"
              :value="levelList[levelList.findIndex((level) => level.level === myLevel.level) + 1].minExp - myLevel.exp"
              show-group-separator
            >
              <template #suffix>
                <span class="ml-[10px]">经验值</span>
              </template>
            </a-statistic>
            <!-- </a-col>
            </a-row> -->
          </div>
        </div>
        <div class="level-card relative w-[90%] mx-auto py-[20px]">
          <a-table :data="levelList" :bordered="false" :page-size="20">
            <template #columns>
              <a-table-column
                align="center"
                title="等级"
                data-index="level"
                :width="100"
                :body-cell-style="summaryCellStyle"
              >
                <template #cell="{ record }"> LV. {{ record.level }} </template>
              </a-table-column>
              <a-table-column
                align="center"
                title="头衔"
                data-index="content"
                :width="200"
                :body-cell-style="summaryCellStyle"
              ></a-table-column>
              <a-table-column
                align="center"
                title="最低经验值"
                data-index="minExp"
                :width="200"
                :body-cell-style="summaryCellStyle"
              ></a-table-column>
              <a-table-column
                align="center"
                title="最高经验值"
                data-index="maxExp"
                :width="200"
                :body-cell-style="summaryCellStyle"
              ></a-table-column>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <div class="mt-[20px]">
      <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
        <span class="text-xl font-bold">成长任务</span>
        <!-- <span class="text-gray-500">等级说明</span> -->
      </div>
      <a-divider margin="0" />
      <div class="flex flex-row flex-wrap bg-white items-center">
        <div
          v-for="(task, index) in tasksList"
          :key="index"
          class="task-card w-[290px] border border-gray-200 rounded-md mx-[10px] my-[15px] flex flex-row flex-nowrap justify-between items-center py-[5px] px-[10px]"
        >
          <div class="left flex flex-col">
            <span class="text-sm text-black h-[30px] leading-[30px] font-bold"> {{ task.value }}</span>
            <div class="flex flex-row justify-start items-center text-xs text-gray-500 h-[30px] leading-[30px]">
              <span> 经验+{{ task.exp }},</span>
              <span class="mr-[5px]"> 黑火+{{ task.fire }}</span>
              <span v-if="task.dailyTimer" class="ml-[10px]">
                已完成 {{ task.expRecord.length }}/{{ task.dailyTimer }}</span
              >
              <span v-else class="ml-[10px]"> 不限次数</span>
            </div>
          </div>
          <div class="w-[70px] h-[30px] leading-[30px] text-white bg-blue-500 text-center rounded-sm">
            <template v-if="task.dailyTimer && Number(task.expRecord.length) === Number(task.dailyTimer)">
              <a-button disabled>已完成</a-button>
            </template>
            <template v-else>
              <router-link class="w-[70px] h-full text-xs bg-blue-500" :to="{ name: task.router }">{{
                task.btnText
              }}</router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import defaultApi, { Level, Task } from '@/api/modules/default';

const tasksList = ref<Array<Task>>([]);
const levelList = ref<Array<Level>>([]);
const myLevel = ref();
const router = useRouter();

const fetchLevelData = () => {
  defaultApi.centerLevel().then((res) => {
    if (res.code === 0) {
      levelList.value = res.data.level;
      myLevel.value = res.data.myLevel;
    }
  });
};

const summaryCellStyle = (record: any) => {
  if (Number(record.level) === Number(myLevel.value.level)) {
    return {
      backgroundColor: 'rgb(219 234 254 / var(--tw-bg-opacity)',
      color: 'rgba(37, 99, 235, var(--tw-bg-opacity))',
      fontWeight: 'bold',
    };
  }
};

const fetchTaskData = () => {
  defaultApi.centerTask().then((res) => {
    if (res.code === 0) {
      tasksList.value = res.data;
    }
  });
};

const gotoPage = (path) => {
  router.push({ name: path });
};

onMounted(() => {
  fetchLevelData();
  fetchTaskData();
});
</script>

<style lang="scss" scoped>
.level-box {
  // @apply mt-[60px];
}
</style>
