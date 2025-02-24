<template>
  <NormalToolbar title="帮助" @click="markHandler">
    <template #trigger>
      <div class="flex flex-col items-center">
        <icon-book size="20" :stroke-width="2" class="text-center" style="margin-top: 2px" />
        <span class="text-xs">帮助</span>
      </div>
    </template>
  </NormalToolbar>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { NormalToolbar } from 'md-editor-v3';

const props = defineProps({
  openModal: {
    type: Function as PropType<() => void>,
    default: () => () => null,
  },
});

const markHandler = () => {
  props.openModal();
};
</script>

<script lang="ts">
export default {
  name: 'MarkExtension',
};
</script>
