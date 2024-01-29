<template>
  <div v-if="showKeywordList">
    <a-trigger trigger="focus" :popup-hover-stay="true" :click-to-close="false" :blur-to-close="false">
      <a-input-search :style="{ width: '320px' }" placeholder="请输入要搜索的内容" @search="searchKeyword" />
      <template #content>
        <div class="demo-basic">
          <span class="text-sky-600 h-10 leading-10 block mr-2 text-right" @click="clearKeywordList">清空搜索历史</span>
          <a-divider margin="0" />
          <div
            v-for="(keyword, index) in keywordList"
            :key="index"
            class="h-10 leading-10 block hover:bg-gray-200 w-full pl-2"
          >
            <span>{{ keyword }}</span>
          </div>
        </div>
      </template>
    </a-trigger>
  </div>
  <div v-else>
    <a-input-search
      :style="{ width: '320px' }"
      placeholder="请输入要搜索的内容"
      search-button
      @search="searchKeyword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';

const showKeywordList = ref(
  Array.isArray(JSON.parse(localStorage.getItem('search_history') as string)) &&
    JSON.parse(localStorage.getItem('search_history') as string).length !== 0,
);

const keywordList = ref<Array<string>>(JSON.parse(localStorage.getItem('search_history') as string));
const searchKeyword = (keyword: string) => {
  if (keyword && keyword.length !== 0) {
    const keywordlist = localStorage.getItem('search_history')
      ? JSON.parse(localStorage.getItem('search_history') as string)
      : [];
    keywordlist.push(keyword);
    localStorage.setItem('search_history', JSON.stringify(keywordlist));
    showKeywordList.value = true;
    keywordList.value = JSON.parse(localStorage.getItem('search_history') as string);
  } else {
    Message.error('请输入搜索关键字');
  }
};

const clearKeywordList = () => {
  localStorage.removeItem('search_history');
  showKeywordList.value = false;
  keywordList.value = [];
};
</script>

<style lang="scss" scoped>
.demo-basic {
  // padding: 10px;
  width: 320px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

  a {
    @apply text-blue-600 hover:(text-blue-600) transition-all ease-out duration-100;
  }
}
</style>
