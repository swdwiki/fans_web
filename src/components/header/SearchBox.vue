<template>
  <div v-if="showKeywordList">
    <a-trigger trigger="focus" :popup-hover-stay="true" :click-to-close="false" :blur-to-close="false">
      <a-input-search
        :style="{ width: '240px' }"
        placeholder="请输入要搜索的内容"
        search-button
        @search="searchKeyword"
      />
      <template #content>
        <div class="demo-basic">
          <div class="head">
            <span class="text-xs">搜索历史</span>
            <span class="text-sky-600 text-xs h-[30px] leading-[30px] block text-right" @click="clearKeywordList"
              >清空</span
            >
          </div>
          <a-divider margin="0" />
          <router-link
            v-for="(keyword, index) in keywordList"
            :key="index"
            :to="{ name: 'SearchResult', query: { keyword: keyword, type: 'post' } }"
            class="h-10 leading-10 block hover:bg-gray-200 w-full pl-2"
          >
            <span>{{ keyword }}</span>
          </router-link>
        </div>
      </template>
    </a-trigger>
  </div>
  <div v-else>
    <a-input-search
      :style="{ width: '240px' }"
      placeholder="请输入要搜索的内容"
      search-button
      @search="searchKeyword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    router.push({ name: 'SearchResult', query: { keyword, type: 'post' } });
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
  width: 240px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);

  .head {
    @apply flex flex-row justify-between items-center px-[10px];
  }

  a {
    @apply text-blue-600 hover:text-blue-600 transition-all ease-out duration-100;
  }
}
</style>
