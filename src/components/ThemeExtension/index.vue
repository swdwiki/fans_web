<template>
  <DropdownToolbar class="border-gray-500" title="emoji表情" :visible="state.visible" @onChange="onChange">
    <template #overlay>
      <div class="emoji-container border-gray-500">
        <ol class="emojis flex flex-col flex-wrap w-30">
          <li
            v-for="(theme, index) of themes"
            :key="`theme-${index}`"
            class="w-full m-1 h-7 leading-7 hover:(bg-gray-300 text-white) text-center"
            @click="themeHandler(theme)"
            v-text="index == 0 ? '默认样式' : `样式${index}`"
          ></li>
        </ol>
      </div>
    </template>
    <template #trigger>
      <div class="flex flex-row items-center">
        <icon-apps size="20" :stroke-width="2" class="text-center" style="margin-top: 2px" />
        <span class="text-xs">样式主题</span>
      </div>
    </template>
  </DropdownToolbar>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { DropdownToolbar } from 'md-editor-v3';
// import type { InsertContentGenerator } from 'md-editor-v3';
import { themes } from './theme';

const props = defineProps({
  onSelect: {
    type: Function as PropType<(theme: string) => void>,
    default: () => () => null,
  },
});

const state = reactive({
  visible: false,
});

const themeHandler = (theme: string) => {
  props.onSelect(theme);
  state.visible = false;
};

const onChange = (visible: boolean) => {
  state.visible = visible;
};
</script>

<script lang="ts">
export default {
  name: 'EmojiExtension',
};
</script>
