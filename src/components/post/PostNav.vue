<template>
  <nav class="post-nav-wrap">
    <div :class="['nav-item-wrap', props.selectSubject === -1 ? 'nav-item-wrap-selected' : '']">
      <div class="nav-item-content" @click="handleChange(-1)">全部</div>
    </div>
    <div
      v-for="(subject, index) in props.subjectList"
      :key="index"
      :class="['nav-item-wrap', props.selectSubject === subject.subjectId ? 'nav-item-wrap-selected' : '']"
    >
      <div class="nav-item-content" @click="handleChange(subject.subjectId)">
        {{ subject.title }}
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps({
  subjectList: {
    type: Array<{
      subjectId: number;
      title: string;
    }>,
    default: () => {
      return [];
    },
  },
  selectSubject: {
    type: Number,
    default: () => {
      return null;
    },
  },
});
const emit = defineEmits(['navChange']);

const handleChange = (subjectId: number | string) => {
  emit('navChange', subjectId);
};
</script>

<style lang="scss" scoped>
.post-nav-wrap {
  min-width: 150px;
  box-sizing: border-box;
  padding: 8px;
  font-size: 16px;

  .nav-item-wrap {
    margin: 10px 0;
    height: 50px;

    @apply flex flex-col text-center hover:bg-blue-500 hover:rounded-md hover:text-white hover:font-bold;
    .nav-item-content {
      line-height: 50px;
      cursor: pointer;
      // display: flex;
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
    }
  }
  .nav-item-wrap-selected {
    @apply bg-blue-500 rounded-md text-white font-bold;
  }
}
</style>
