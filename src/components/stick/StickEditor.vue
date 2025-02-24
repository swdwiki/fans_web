<template>
  <div class="stick-editor">
    <div class="submit-stick bg-white w-full pb-5">
      <div class="w-full mx-auto px-5 group py-[20px]">
        <div
          class="editor-content editor border rounded-md"
          :class="[showFocusBorder ? 'border-blue-500 bg-white' : 'border-gray-100 bg-gray-100']"
        >
          <div
            ref="editorRef"
            class="rich-input transition duration-150 ease-out p-2 focus:bg-white transtion-all ease-in duration-100 text-sm leading-6 h-[100px] outline-none rounded-tl-md rounded-tr-md overflow-scroll w-full"
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

          <div class="flex flex-row justify-between items-end">
            <div>
              <div class="mb-[10px]">
                <span ref="clubRef" class="club-select" @click="showClubSelect = !showClubSelect">
                  <span class="mr-[3px]">{{ selectClubThemeText || '请选择圈子' }}</span>
                  <icon-right :size="12" />
                </span>
              </div>
              <a-trigger
                :trigger="['click']"
                unmount-on-close
                :popup-visible="showClubSelect"
                :render-to-body="false"
                :update-at-scroll="false"
                :popup-container="clubRef"
              >
                <template #content>
                  <div class="demo-basic bg-white rounded-sm border border-gray-200">
                    <div class="list">
                      <div class="topic-list flex flex-row h-[300px] w-[300px] rounded-sm overflow-scroll">
                        <div class="left flex flex-col py-[10px] bg-gray-100 border-r border-r-gray-200">
                          <span
                            v-for="(club, index) in clubs"
                            :key="index"
                            class="h-[40px] w-[100px] leading-[40px] text-center"
                            :class="[clubParentIndex === index ? 'bg-blue-100 text-blue-500 font-bold' : '']"
                            @click="selectClubParentIndex(index)"
                            >{{ club.name }}</span
                          >
                        </div>
                        <div
                          class="w-full h-full right flex flex-col justify-start items-start py-[10px] overflow-scroll"
                        >
                          <div
                            v-for="theme in clubs[clubParentIndex].themes"
                            :key="theme.themeId"
                            class="w-full min-h-[40px] h-[40px] flex flex-row items-center justify-start hover:bg-gray-50"
                            @click="selectClubThemes(theme)"
                          >
                            <div class="ml-[10px] h-full topic-info flex flex-col justify-center items-start">
                              <span class="font-semiboldblock text-sm">{{ theme.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        class="no-select h-[50px] border-t border-t-gray-200 flex flex-row justify-end items-center px-[20px]"
                      >
                        <a-button size="mini" type="primary" @click="noSelectClubThemes">不选择圈子</a-button>
                      </div>
                    </div>
                  </div>
                </template>
              </a-trigger>
              <div
                v-if="imgList && imgList.length !== 0"
                class="imglist ml-[10px] mb-[10px]"
                :class="[showFocusBorder ? 'bg-white' : 'bg-gray-100']"
              >
                <a-upload
                  :action="fileUploadUrl"
                  :multiple="false"
                  accept="image/*,"
                  name="file"
                  :headers="headers"
                  :file-list="fileList"
                  :draggable="false"
                  :limit="9"
                  list-type="picture-card"
                  image-preview
                  @error="handleCoverError"
                  @before-remove="removeImage"
                  @success="uploadCoverSuccess"
                  @before-upload="beforeUpload"
                />
              </div>
            </div>

            <span
              class="bg-gray-100 block p-2 text-xs text-right rounded-bl-md rounded-br-md w-[130px]"
              :class="[
                showFocusBorder ? 'bg-white' : '',
                repalceHtmlToText(modelValue).length > maxStickTextCount ? 'text-red-500 font-bold' : 'text-gray-400',
              ]"
              >{{ repalceHtmlToText(modelValue).length }}/{{ maxStickTextCount }}</span
            >
          </div>
        </div>
      </div>
      <div class="handle flex flex-row justify-between items-center px-5">
        <div class="left flex flex-row justify-start items-center">
          <a-trigger trigger="click" position="bl" :popup-translate="[0, 5]" show-arrow>
            <div class="flex flex-row justify-start items-center mr-[18px] text-xs">
              <icon-face-smile-fill class="mr-[3px]" :size="18" />
              <span>表情</span>
            </div>
            <template #content>
              <div class="w-[370px] p-2 rounded-sm shadow-dark-600 bg-gray-50">
                <emoji-box @add-emoji="addEmoji"></emoji-box>
              </div>
            </template>
          </a-trigger>
          <div class="flex flex-row justify-start items-center">
            <a-upload
              :action="fileUploadUrl"
              :multiple="false"
              accept="image/*,"
              :show-file-list="false"
              name="file"
              :headers="headers"
              :file-list="fileList"
              :draggable="false"
              :limit="9"
              @error="handleCoverError"
              @success="uploadCoverSuccess"
              @before-upload="beforeUpload"
            >
              <template #upload-button>
                <div>
                  <div class="flex flex-row justify-start items-center mr-[18px] text-xs">
                    <icon-image class="mr-[3px]" :size="18" />
                    <span>图片</span>
                  </div>
                </div>
              </template>
            </a-upload>
          </div>
        </div>
        <div class="right w-[100px]">
          <a-button type="primary" size="large" class="w-full" :disabled="submitStickDisabled" @click="submit"
            >发布尺牍</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileItem, Modal } from '@arco-design/web-vue';
import { repalceHtmlToText } from '@/utils/format';
import { Pagination } from '@/utils/global';
import { Images } from '@/api/modules/default';
import useLoading from '@/hooks/loading';
import useHeader from '@/hooks/header';
import emojis from '@/components/EmojiExtension/data';
import { useUserStore } from '@/store';
import { CustomEmoji } from '../EmojiBox.vue';

const fileList = ref<Array<FileItem>>([]);
const showFocusBorder = ref(false);
const text = ref();
const clubRef = ref<HTMLElement>();

interface Theme {
  themeId: number;
  name: string;
  cover: string;
  desc?: string;
  stickCount: number;
}

interface Club {
  clubId: number;
  name: string;
  desc?: string;
  themes: Array<Theme>;
}

interface Props {
  placeholder?: string;
  modelValue: string;
  minHeight?: number;
  imgList?: Images[];
  maxStickTextCount: number;
  clubs: Array<Club>;
}

const editorRef = ref();
const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

const props = withDefaults(defineProps<Props>(), {
  minHeight: 30,
  maxStickTextCount: 400,
  placeholder: '在天书世界中分享你的新鲜事',
});

const clubParentIndex = ref(0);
const range = ref<Range>();

const showClubSelect = ref(false);

const submitStickDisabled = ref(true);

const selectClubParentIndex = (index: number) => {
  clubParentIndex.value = index;
};

const selectClubThemeText = ref('');

const { headers } = useHeader();

const emit = defineEmits<{
  (event: 'submit'): void;
  (e: 'update:modelValue', val: string): void;
  (e: 'input', event: Event): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'uploadSuccess', fileItem: FileItem): void;
  (e: 'uploadError', fileItem: FileItem): void;
  (e: 'pasteImg', event: Event, file: any): void;
  (e: 'removeFile', index: number): void;
  (e: 'selectClub', id?: number | undefined): void;
}>();

const clear = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = '';
    fileList.value = [];
    submitStickDisabled.value = true;
    clubParentIndex.value = 0;
    selectClubThemeText.value = '';
    emit('update:modelValue', editorRef.value.innerHTML);
  }
};

const selectClubThemes = (theme: Theme) => {
  const { themeId, name } = theme;
  selectClubThemeText.value = name;
  emit('selectClub', themeId);
  showClubSelect.value = false;
};

const noSelectClubThemes = () => {
  selectClubThemeText.value = '';
  emit('selectClub');
  showClubSelect.value = false;
};

const removeImage = (fileItem: FileItem): Promise<boolean> => {
  const removeIndex = fileList.value.findIndex((file: FileItem) => {
    return fileItem.uid === file.uid;
  });
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: '删除图片',
      content: `确认删除 ${fileItem.name}`,
      onOk: () => {
        emit('removeFile', removeIndex);
        fileList.value.splice(removeIndex, 1);
        resolve(true);
      },
      onCancel: () => reject(new Error('删除失败')),
    });
  });
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

const beforeUpload = (file: File) => {
  console.log(file, '上传前');
  return true;
};

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

const onFocus = (event: Event) => {
  showFocusBorder.value = true;
  emit('focus', event);
};

const onBlur = (event: Event) => {
  try {
    range.value = window.getSelection()?.getRangeAt(0);
  } catch (error) {
    console.log(error);
  }
  emit('blur', event);
  showFocusBorder.value = false;
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

const uploadCoverSuccess = (fileItem: FileItem) => {
  console.log(fileItem, '上传成功');
  nextTick();
  fileList.value.push(fileItem);
  nextTick();
  emit('uploadSuccess', fileItem);
  nextTick();
};

const handleCoverError = (fileItem: any) => {
  emit('uploadError', fileItem);
};

const { isLoginStatus } = useUserStore();
const injectHandle: any = inject('authModal');

const submit = () => {
  if (isLoginStatus) {
    emit('submit');
  } else {
    injectHandle.openAuthModal('login');
  }
};

defineExpose({ clear });
</script>

<style lang="scss" scoped>
.rich-input {
  line-height: 22px;
  display: inline-block;
  box-sizing: border-box;
  transition: background 0.3s;
  .mentionUser {
    background-color: red;
  }
}
.rich-input:empty::before {
  cursor: text;
  content: attr(placeholder);
  @apply text-gray-400;
}

.club-select {
  @apply cursor-pointer bg-gray-50 py-[5px] px-[10px] text-xs rounded-xl text-blue-500 ml-[5px];
}
</style>
