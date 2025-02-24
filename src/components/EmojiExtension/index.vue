<template>
  <DropdownToolbar title="emoji" :visible="state.visible" @change="onChange">
    <template #overlay>
      <div class="emoji-container border-gray-100 border">
        <ol class="emojis flex flex-row flex-wrap w-80">
          <li
            v-for="(emoji, index) of emojis"
            :key="`emoji-${index}`"
            class="w-4 m-2 text-xl"
            @click="emojiHandler(emoji)"
            v-text="emoji"
          ></li>
        </ol>
      </div>
    </template>
    <template #trigger>
      <div class="flex flex-col items-center">
        <icon-face-smile-fill size="20" :stroke-width="2" class="text-center" style="margin-top: 2px" />
        <span class="text-xs">表情</span>
      </div>
    </template>
  </DropdownToolbar>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { DropdownToolbar } from 'md-editor-v3';
import type { InsertContentGenerator } from 'md-editor-v3';
import emojis from './data';

const props = defineProps({
  onInsert: {
    type: Function as PropType<(generator: InsertContentGenerator) => void>,
    default: () => () => null,
  },
});

const state = reactive({
  visible: false,
});

const emojiHandler = (emoji: string) => {
  const generator: InsertContentGenerator = () => {
    return {
      targetValue: emoji,
      select: false,
      deviationEnd: emoji.length,
    };
  };

  props.onInsert(generator);
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
