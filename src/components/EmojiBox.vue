<template>
  <div>
    <a-tabs>
      <a-tab-pane key="default" title="基础表情">
        <span
          v-for="(emoji, index) in emojis"
          :key="index"
          class="text-2xl mx-[5px] mt-[5px] mb-[20px] p-[5px] w-[30px] h-[30px]"
          @click="addEmoji(emoji)"
          >{{ emoji }}</span
        >
      </a-tab-pane>
      <a-tab-pane key="ghost" title="符鬼系列">
        <div class="flex flex-row flex-wrap justify-start items-center">
          <div
            v-for="(ghost, index) in ghosts"
            :key="index"
            class="mx-[5px] mt-[5px] mb-[20px] p-[5px] w-[30px] h-[30px]"
            @click="addCustomEmoji(ghost)"
          >
            <a-tooltip :content="ghost.name">
              <img class="w-[30px] h-[30px] block w-full" draggable="false" :src="ghost.path" />
            </a-tooltip>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import emojis from '@/components/EmojiExtension/data';
import ghosts from '@/components/EmojiExtension/ghost';

export interface CustomEmoji {
  name: string;
  path: string;
}
const emit = defineEmits<{
  (e: 'addEmoji', emoji: string): void;
}>();

const addCustomEmoji = (emoji: CustomEmoji) => {
  const emojiRes = `<img draggable="false" src="${emoji.path}" alt="${emoji.name}" style="width:26px;height:26px;display:inline-block;" />`;
  emit('addEmoji', emojiRes);
};

const addEmoji = (emoji: string) => {
  const emojiRes = `${emoji}`;
  emit('addEmoji', emojiRes);
};
</script>

<style scoped></style>
