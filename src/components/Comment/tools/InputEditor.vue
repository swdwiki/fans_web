<template>
  <div class="input-editor">
    <div class="submit-stick bg-white w-full pb-5">
      <div class="w-full mx-auto group">
        <div
          v-if="showInputEditor"
          class="editor-content editor border rounded-md relative"
          :class="[showFocusBorder ? 'border-blue-500 bg-white' : 'border-gray-100 bg-gray-100']"
          @click.stop="commentBoxClick"
        >
          <div
            ref="editorRef"
            class="rich-input p-2 text-sm leading-6 h-[60px] outline-none rounded-tl-md rounded-tr-md h-[120px] overflow-scroll text-sm w-full"
            contenteditable
            :spellcheck="false"
            :placeholder="placeholder"
            :max-length="400"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
            @paste="pasteFn"
            v-html="text"
          ></div>
          <div class="flex flex-row justify-end items-end">
            <span
              class="bg-gray-100 block p-2 text-xs text-right rounded-bl-md rounded-br-md w-[130px] focus:bg-white"
              :class="[
                showFocusBorder ? 'bg-white' : '',
                repalceHtmlToText(modelValue).length > maxStickTextCount ? 'text-red-500 font-bold' : 'text-gray-400',
              ]"
              >{{ repalceHtmlToText(modelValue).length }}/{{ maxStickTextCount }}</span
            >
          </div>
          <div class="handle flex flex-row justify-between items-center pb-[10px] px-[10px]">
            <div class="left flex flex-row justify-start items-center">
              <a-trigger trigger="click" position="bl" :popup-translate="[0, 5]" show-arrow :auto-fit-position="false">
                <div class="flex flex-row justify-start items-center mr-[18px] text-xs text-gray-500">
                  <icon-face-smile-fill class="mr-[3px]" :size="18" />
                  <span>表情</span>
                </div>
                <template #content>
                  <div class="w-[370px] p-2 rounded-sm shadow-dark-600 bg-gray-50">
                    <div>
                      <emoji-box @add-emoji="addEmoji"></emoji-box>
                    </div>
                  </div>
                </template>
              </a-trigger>
            </div>
            <div class="right">
              <a-button type="primary" :disabled="submitStickDisabled" @click="submit">{{ btnText }}</a-button>
            </div>
          </div>
        </div>
        <div v-else>
          <slot name="offline"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileItem } from '@arco-design/web-vue';
import { repalceHtmlToText } from '@/utils/format';
import { Images } from '@/api/modules/default';

import { useUserStore } from '@/store/index';
import { CustomEmoji } from '@/components/EmojiBox.vue';

const fileList = ref<Array<FileItem>>([]);
const showFocusBorder = ref(false);
const text = ref('');

interface Props {
  placeholder?: string;
  modelValue: string;
  minHeight?: number;
  imgList?: Images[];
  maxStickTextCount: number;
  btnText: string;
  showInputEditor: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: 30,
  maxStickTextCount: 400,
  placeholder: '在天书世界中分享你的新鲜事',
  btnText: '发送',
  showInputEditor: false,
});

const editorRef = ref<any>();

const commentBoxClick = (event: Event) => {
  showFocusBorder.value = true;
  editorRef.value?.focus();
  event.stopPropagation();
};

const range = ref<Range>();

const submitStickDisabled = ref(true);

// const { headers } = useHeader();

const emit = defineEmits<{
  (event: 'submit'): void;
  (e: 'update:modelValue', val: string): void;
  (e: 'input', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'focus', event: Event): void;
  (e: 'uploadSuccess', fileItem: FileItem): void;
  (e: 'uploadError', fileItem: FileItem): void;
  (e: 'pasteImg', event: Event, file: any): void;
  (e: 'removeFile', index: number): void;
}>();

function pasteFn(event: ClipboardEvent) {
  const { clipboardData } = event;
  if (clipboardData) {
    const texts = clipboardData.getData('text/plain');
    const file = clipboardData.items.length > 0 ? clipboardData.items[0].getAsFile() : null;
    if (text) {
      event.preventDefault(); // 阻止默认的粘贴行为
      document.execCommand('insertText', false, texts); // 插入纯文本
    } else if (file) {
      event.preventDefault(); // 阻止默认的粘贴行为
      // 处理粘贴的文件，例如上传到服务器
      emit('pasteImg', event, file);
    }
  }
}
const { userInfo, isLoginStatus } = useUserStore();
const injectHandle: any = inject('authModal');

const onFocus = (event: Event) => {
  if (isLoginStatus) {
    showFocusBorder.value = true;
    emit('focus', event);
  } else {
    injectHandle.openAuthModal('login');
  }
};

const onBlur = (event: Event) => {
  try {
    range.value = window.getSelection()?.getRangeAt(0);
  } catch (error) {
    console.log(error);
  }
  showFocusBorder.value = false;
  emit('blur', event);
};

const onInput = (event: Event): void => {
  try {
    range.value = window.getSelection()?.getRangeAt(0);
  } catch (error) {
    console.log(error);
  }
  const { innerHTML } = event.target as HTMLDivElement;
  const result = repalceHtmlToText(innerHTML);
  if (result.length !== 0) {
    if (result.length > props.maxStickTextCount) {
      submitStickDisabled.value = true;
    } else {
      submitStickDisabled.value = false;
    }
  } else {
    submitStickDisabled.value = true;
  }
  emit('update:modelValue', innerHTML);
  emit('input', event);
};

function addText(val: string, isPop?: boolean) {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    // 为空初始化光标
    if (!range.value) {
      editorRef.value?.focus();
      range.value = selection.getRangeAt(0);
    }
    // 删除选中内容
    range.value.deleteContents();
    // 添加内容
    range.value.insertNode(range.value.createContextualFragment(val));
    range.value.collapse(false);
    selection.addRange(range.value);

    const result = repalceHtmlToText(editorRef.value?.innerHTML);
    if (result.length !== 0) {
      if (result.length > props.maxStickTextCount) {
        submitStickDisabled.value = true;
      } else {
        submitStickDisabled.value = false;
      }
    } else {
      submitStickDisabled.value = true;
    }
    emit('update:modelValue', editorRef.value?.innerHTML || '');
    const event = editorRef.value as unknown as Event;
    emit('input', event);
  }
}

const addEmoji = (emoji: string) => {
  addText(emoji);
};

const submit = () => {
  emit('submit');
};

const clear = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = '';
    // fileList.value = [];
    submitStickDisabled.value = true;
    emit('update:modelValue', editorRef.value.innerHTML);
  }
};

defineExpose({
  clear,
});
</script>

<style lang="scss" scoped>
.rich-input {
  box-sizing: border-box;
  transition: background 0.3s;
  .mentionUser {
    background-color: red;
  }
}
.rich-input:empty::before {
  // cursor: text;
  content: attr(placeholder);
  @apply text-gray-400;
}
</style>
