<template>
  <div v-loading="loading" class="editor">
    <div class="header flex flex-row justify-between items-center">
      <a-input v-model="postForm.title" class="title-input" placeholder="请输入帖子标题" size="large"></a-input>
      <div class="pr-5">
        <!-- <a-popconfirm
          content="切换后若原内容未保存则会自动清空，是否确定切换编辑器？"
          @ok="changeEditorType(editorType)"
        >
          <a-button class="mx-2" type="text" size="small">
            <template #icon>
              <icon-swap :stroke-width="2" />
            </template>
            <span v-if="editorType === 1"> 切换Markdown编辑器 </span>
            <span v-if="editorType === 2"> 切换富文本编辑器 </span>
          </a-button>
        </a-popconfirm> -->
        <a-button class="mx-2" type="text" size="small" @click="goHome">返回首页</a-button>
        <!-- <a-button class="mx-2" type="outline" size="small" @click="savePost">保存到草稿箱</a-button> -->
        <a-trigger
          position="br"
          auto-fit-position
          :unmount-on-close="false"
          trigger="click"
          :show-arrow="true"
          :popup-translate="[30, 10]"
        >
          <a-button class="mx-2" type="primary" size="small">发布</a-button>
          <template #content>
            <div class="demo-arrow w-100">
              <div class="header h-12 border-solid border-b-gray-200 border-b w-full p-0">
                <span class="leading-[3rem] block font-bold text-base text-center">发布帖子</span>
              </div>
              <div class="w-11/12 mx-auto my-5">
                <a-form ref="postFormRef" :model="postForm" auto-label-width>
                  <a-form-item
                    field="subjectId"
                    label="分类"
                    :rules="[
                      {
                        required: true,
                        message: '请选择分类',
                      },
                    ]"
                    :validate-trigger="['change', 'input']"
                  >
                    <a-radio-group v-model="postForm.subjectId" type="button" @change="changeSubject">
                      <a-grid :cols="4" :col-gap="24" :row-gap="16">
                        <a-grid-item
                          v-for="subjectInfo in subjectList"
                          :key="subjectInfo.subjectId"
                          class="bg-gray-200 w-full text-center"
                        >
                          <a-radio :value="subjectInfo.subjectId">{{ subjectInfo.title }}</a-radio>
                        </a-grid-item>
                      </a-grid>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item
                    v-if="postForm.subjectId"
                    field="plateId"
                    label="板块"
                    :rules="[
                      {
                        required: true,
                        message: '请选择板块',
                      },
                    ]"
                    :validate-trigger="['change', 'focus']"
                  >
                    <a-select v-model="postForm.plateId" placeholder="请选择板块" :allow-create="false">
                      <a-option
                        v-for="plate in subjectList[
                          subjectList.findIndex((subject) => subject.subjectId === postForm.subjectId)
                        ].plates"
                        :key="plate.plateId"
                        :label="plate.name"
                        :value="plate.plateId"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item field="tagList" label="标签">
                    <a-select
                      v-model="postForm.tagList"
                      placeholder="请选择或输入标签"
                      :allow-create="true"
                      multiple
                      :limit="5"
                      value-key="name"
                    >
                      <template #header>
                        <span class="text-sm leading-8 h-8 text-gray-600 ml-5"
                          >最多只能选择或输入5个标签，已选择或输入{{
                            postForm.tagList && postForm.tagList.length
                          }}个标签</span
                        >
                      </template>
                      <a-option
                        v-for="(tagInfo, index) in tagsList"
                        :key="index"
                        :label="tagInfo.name"
                        :value="tagInfo.name"
                      ></a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item field="columns" label="帖子封面">
                    <a-upload
                      :action="fileUploadUrl"
                      :multiple="false"
                      accept="image/*,"
                      :show-file-list="false"
                      name="file"
                      :headers="headers"
                      :file-list="fileList"
                      :draggable="true"
                      @success="uploadCoverSuccess"
                      @error="handleCoverError"
                    >
                      <template #upload-button>
                        <div
                          v-if="!postForm.cover"
                          style="color: var(--color-text-1)"
                          class="w-[300px] h-[200px] rounded-sm flex flex-col justify-center items-center border-dashed border border-gray-400 bg-white"
                        >
                          <div class="flex flex-row justify-center items-center">
                            <span class="mx-1"><icon-plus size="15" /></span>
                            <span class="mx-1 block text-base">点击上传图片</span>
                          </div>
                          <p class="h-10 leading-10 text-xs text-center text-gray-500">建议尺寸：200*134像素</p>
                        </div>
                        <div
                          v-else
                          class="w-[300px] h-[200px] rounded-sm border-dashed border border-gray-400 bg-white"
                        >
                          <img
                            :src="postForm.cover"
                            width="480px"
                            height="270px"
                            class="object-cover w-[300px] h-[200px]"
                          />
                        </div>
                      </template>
                    </a-upload>
                  </a-form-item>
                  <a-form-item
                    field="columns"
                    label="收录专栏"
                    :rules="[{ type: 'array', maxLength: 2, message: '最多选择两个专栏' }]"
                    :validate-trigger="['change', 'input']"
                  >
                    <a-select
                      v-model="postForm.columnId"
                      placeholder="请选择专栏"
                      :multiple="false"
                      show-header-on-empty
                      :allow-create="false"
                    >
                      <a-option
                        v-for="column in userColumnList"
                        :key="column.columnId"
                        :value="column.columnId"
                        :label="column.name"
                      ></a-option>
                      <template #label="{ data }">
                        <span>{{ data?.label }}</span>
                      </template>
                      <template #empty>
                        <a-empty description="当前暂无专栏"></a-empty>
                      </template>
                      <template #header>
                        <div class="h-10 leading-10 text-center flex flex-row justify-between px-5">
                          <router-link target="_blank" class="text-center block" :to="{ name: 'ColumnCreator' }"
                            >点此新建专栏</router-link
                          >
                          <span class="leading-10 text-blue-600" @click="getMyColumn"
                            ><icon-sync
                              :stroke-width="5"
                              class="mr-1 transform"
                              stroke-linejoin="arcs"
                              :class="[columnsLoading ? 'animate-spin' : '']"
                            />同步我的专栏</span
                          >
                        </div>
                      </template>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    field="desc"
                    label="摘要简介"
                    :rules="[
                      {
                        required: true,
                        message: '请输入图文摘要简介',
                      },
                    ]"
                  >
                    <a-textarea
                      v-model="postForm.desc"
                      :auto-size="{
                        minRows: 4,
                        maxRows: 10,
                      }"
                      placeholder="请输入摘要简介"
                      max-length="200"
                      :show-word-limit="true"
                    />
                  </a-form-item>
                </a-form>
              </div>
              <div class="footer border-t border-t-gray-100 flex flex-row flex-nowrap justify-end items-center py-5">
                <a-button class="mx-2" type="outline" status="danger">取消</a-button>
                <!-- <a-button class="mx-2" status="warning" @click="savePost">保存到草稿箱</a-button> -->
                <a-button class="mr-5 ml-2" type="primary" :loading="loading" @click="submitPost">确定并发布</a-button>
              </div>
            </div>
          </template>
        </a-trigger>
        <a-avatar>
          <img alt="avatar" :src="userInfo.avatar" />
        </a-avatar>
      </div>
    </div>
    <div class="editor">
      <a-drawer
        :visible="modalVisible"
        :mask="true"
        :mask-closable="true"
        :footer="false"
        width="300px"
        @cancel="modalVisible = false"
      >
        <template #title> Markdown编辑器帮助 </template>
        <div class="md-help">
          <h2 class="text-base font-bold">Markdown 语法</h2>
          <ul>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M6 8v32M25 8v32M6 24h19M34.226 24 39 19.017V40"
                  ></path>
                </svg>
              </div>
              <div class="help-title">一级标题</div>
              <div class="help-content"><code># 标题</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M6 8v32M24 8v32M7 24h16M32 25c0-3.167 2.667-5 5-5s5 1.833 5 5c0 5.7-10 9.933-10 15h10"
                  ></path>
                </svg>
              </div>
              <div class="help-title">二级标题</div>
              <div class="help-content"><code>## 标题</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M6 8v32M24 8v32M7 24h16M32 20h10l-7 9c4 0 7 2 7 6s-3 5-5 5c-2.381 0-4-1-5-2.1"
                  ></path>
                </svg>
              </div>
              <div class="help-title">三级标题</div>
              <div class="help-content"><code>### 标题</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M24 24c5.506 0 9.969-4.477 9.969-10S29.506 4 24 4H11v20h13ZM28.031 44C33.537 44 38 39.523 38 34s-4.463-10-9.969-10H11v20h17.031Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="help-title">粗体</div>
              <div class="help-content"><code>**粗体文本**</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M20 6h16M12 42h16M29 5.952 19 42"
                  ></path>
                </svg>
              </div>
              <div class="help-title">斜体</div>
              <div class="help-content"><code>*斜体文本*</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M18.853 9.116C11.323 13.952 7.14 19.58 6.303 26.003 5 36 13.94 40.893 18.47 36.497 23 32.1 20.285 26.52 17.005 24.994c-3.28-1.525-5.286-.994-4.936-3.033.35-2.038 5.016-7.69 9.116-10.322a.749.749 0 0 0 .114-1.02L20.285 9.3c-.44-.572-.862-.55-1.432-.185ZM38.679 9.116c-7.53 4.836-11.714 10.465-12.55 16.887-1.303 9.997 7.637 14.89 12.167 10.494 4.53-4.397 1.815-9.977-1.466-11.503-3.28-1.525-5.286-.994-4.936-3.033.35-2.038 5.017-7.69 9.117-10.322a.749.749 0 0 0 .113-1.02L40.11 9.3c-.44-.572-.862-.55-1.431-.185Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="help-title">引用</div>
              <div class="help-content"><code>&gt; 引用文本</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="m26.24 16.373-9.14-9.14c-2.661-2.661-7.035-2.603-9.768.131-2.734 2.734-2.793 7.107-.131 9.768l7.935 7.936M32.903 23.003l7.935 7.935c2.661 2.662 2.603 7.035-.13 9.769-2.735 2.734-7.108 2.792-9.77.13l-9.14-9.14"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M26.11 26.142c2.733-2.734 2.792-7.108.13-9.769M21.799 21.798c-2.734 2.734-2.792 7.108-.131 9.769"
                  ></path>
                </svg>
              </div>
              <div class="help-title">链接</div>
              <div class="help-content"><code>[链接描述](url)</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M5 10a2 2 0 0 1 2-2h34a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10Z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M14.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                    clip-rule="evenodd"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="m15 24 5 4 6-7 17 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4l10-10Z"
                  ></path>
                </svg>
              </div>
              <div class="help-title">图片</div>
              <div class="help-content"><code>![alt](url "图片描述")</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M9 42a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM9 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM9 28a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M21 24h22M21 38h22M21 10h22"
                  ></path>
                </svg>
              </div>
              <div class="help-title">无序列表</div>
              <div class="help-content"><code>- 项目</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M9 4v9M12 13H6M12 27H6M6 20s3-3 5 0-5 7-5 7M6 34.5s2-3 5-1 0 4.5 0 4.5 3 2.5 0 4.5-5-1-5-1M11 38H9M9 4 6 6M21 24h22M21 38h22M21 10h22"
                  ></path>
                </svg>
              </div>
              <div class="help-title">有序列表</div>
              <div class="help-content"><code>1. 项目</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M5 24h38M21 38h6M37 38h6M21 10h6M5 38h6M5 10h6M37 10h6"
                  ></path>
                </svg>
              </div>
              <div class="help-title">分割线</div>
              <div class="help-content"><code>---</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M5 24h38M24 24c16 6 10 20 0 20s-12-8-12-8M36 12s-3-8-12-8-12.564 7.6-8.39 14"
                  ></path>
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    d="M12 36s4 8 12 8 12.564-7.6 8.39-14"
                  ></path>
                </svg>
              </div>
              <div class="help-title">删除线</div>
              <div class="help-content"><code>~~文本~~</code></div>
            </li>
            <li>
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 48 48">
                  <g
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    clip-path="url(#a)"
                  >
                    <path d="M42 20v19a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h21"></path>
                    <path d="m16 20 10 8L41 7"></path>
                  </g>
                  <defs>
                    <clipPath id="a"><path fill="currentColor" d="M0 0h48v48H0z"></path></clipPath>
                  </defs>
                </svg>
              </div>
              <div class="help-title">任务列表</div>
              <div class="help-content"><code>- [ ] 待办事项</code></div>
            </li>
          </ul>
        </div>
      </a-drawer>

      <a-spin :loading="editorLoading" tip="图片上传中" class="w-full" dot>
        <md-editor
          v-if="editorType === 2"
          id="mdeditor"
          ref="editorRef"
          v-model="postForm.content"
          class="md-editor-block"
          :toolbars="toolbars"
          :toolbars-exclude="toolbarsExclude"
          :preview-theme="previewTheme"
          code-theme="atom"
          :show-toolbar-name="true"
          @on-upload-img="onUploadImg"
        >
          <template #defToolbars>
            <MovExtension @insert="insertUrl" />
            <EmojiExtension @insert="insert" />
            <ThemeExtension :selected-theme="previewTheme" @select="selectTheme" />
            <MarkExtension :open-modal="openModal" />
          </template>
        </md-editor>
      </a-spin>
      <!-- <div v-if="editorType === 1" class="m-auto" style="border-top: 1px #e6e6e6 solid">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorHtmlRef"
          :default-config="toolbarConfig"
          :mode="mode"
        />
        <Editor
          v-model="postForm.content"
          style="height: calc(100vh - 52px); overflow-y: hidden"
          :default-config="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
        />
      </div> -->
    </div>
  </div>
  <a-modal :visible="showResultModalVisible" :hide-cancel="true" :footer="false" :closable="false">
    <template #title> 编辑帖子 </template>
    <div class="flex flex-col justify-center items-center">
      <div class="flex flex-row justify-center items-center">
        <div class="text-green-600">
          <IconCheck size="30" />
        </div>
        <span class="text-base font-bold">编辑帖子成功</span>
      </div>
      <div class="flex flex-row justify-center items-center mt-[20px]">
        <a-button class="mx-[10px]" type="primary" @click="gotoUrl('PostDetail', { postId: postResId })"
          >查看帖子详情</a-button
        >
        <a-button class="mx-[10px]" status="normal" type="outline" @click="gotoUrl('home')">返回首页</a-button>
        <a-button class="mx-[10px]" status="normal" type="outline" @click="gotoUrl('PostsCreator')"
          >返回创作者中心</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import 'md-editor-v3/lib/style.css';
import { onBeforeUnmount, reactive, ref, onMounted, shallowRef } from 'vue';
import { MdEditor } from 'md-editor-v3';
import type { ExposeParam, InsertContentGenerator } from 'md-editor-v3';
import '@wangeditor-next/editor/dist/css/style.css'; // 引入 css
import { FileItem, Message } from '@arco-design/web-vue';
// import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { Pagination } from '@/utils/global';
import postApi from '@/api/modules/post';
import { useUserStore } from '@/store';

import EmojiExtension from '@/components/EmojiExtension/index.vue';
import ThemeExtension from '@/components/ThemeExtension/index.vue';
import MarkExtension from '@/components/MarkExtension/index.vue';
import MovExtension from '@/components/MovExtension/index.vue';
import useLoading from '@/hooks/loading';
import useHeader from '@/hooks/header'; // 引入 css
import defaultApi from '@/api/modules/default';

const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

interface userColumn {
  columnId: number;
  name: string;
  desc?: string;
  cover?: string;
}

interface plate {
  plateId: number;
  name: string;
  desc?: string;
  subjectId?: string;
}

interface subject {
  subjectId: number;
  title: string;
  plates: Array<plate>;
  [key: string]: unknown;
}

interface tag {
  tagId: number;
  name: string;
}

const userColumnList = ref<Array<userColumn>>([]);
const subjectList = ref<Array<subject>>([]);

const { userInfo } = useUserStore();

const tagsList = ref<Array<tag>>([]);

const fileList = ref([]);
const postFormRef = ref<any>(null);

const editorRef = ref<ExposeParam>();
const editorHtmlRef = shallowRef();
const editorType = ref<number>(2);
const columnsLoading = ref(false);
const postResId = ref(0);

const { headers } = useHeader();

const router = useRouter();

const showResultModalVisible = ref(false);

const gotoUrl = (url: string, params?: any) => {
  console.log(params);
  router.replace({
    name: url,
    params,
  });
};
const { loading, setLoading } = useLoading();
const editorLoading = ref(false);

const postForm = reactive({
  title: '',
  desc: '',
  content: undefined,
  columnId: undefined,
  cover: '',
  activityId: undefined,
  tagList: [],
  subjectId: undefined,
  plateId: undefined,
  editorType: 'markdown',
  markdownConfig: {
    theme: 'default',
  },
});

const savePost = () => {
  // if(!postForm.title.replace(/\s+/g, '')){
  //   Message.error('请输入标题')
  // }else if(!postForm.content.replace(/\s+/g, '')){
  //   Message.error('请输入内容');
  // }else{
  // }
};

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const tagPagination = reactive({
  ...basePagination,
});

const submitPost = () => {
  setLoading(true);
  postFormRef.value.validate((valid: any) => {
    if (!valid) {
      postApi
        .createPost({
          ...postForm,
        })
        .then((res) => {
          console.log(res);
          if (res.code === 0) {
            Message.success('发布成功');
            postResId.value = res.data.postId;
            setLoading(false);
            showResultModalVisible.value = true;
          } else {
            setLoading(false);
            showResultModalVisible.value = false;
          }
        })
        .catch((err) => {
          setLoading(false);
          showResultModalVisible.value = false;
          console.log(err, '发布');
          Message.error('请完善必填信息后再发布');
        });
    } else {
      setLoading(false);
    }
  });
};

const changeSubject = () => {
  postForm.plateId = undefined;
};

const getMyColumn = () => {
  columnsLoading.value = true;
  postApi
    .getAllColumnList()
    .then((res) => {
      setTimeout(() => {
        columnsLoading.value = false;
        userColumnList.value = res.data;
        // Message.success('更新成功');
      }, 1000);
    })
    .catch((err) => {
      console.log(err);
      columnsLoading.value = false;
    });
};

const queryTagsList = () => {
  defaultApi.getTagList().then((res) => {
    console.log(res, 'tag');
    if (res.code === 0) {
      tagsList.value = res.data;
    }
  });
};

const querySubjectList = () => {
  postApi
    .getSubjectList()
    .then((res) => {
      if (res.code === 0) {
        subjectList.value = res.data;
      } else {
        Message.error(res.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(async () => {
  setTimeout(() => {
    postForm.content = undefined;
  }, 500);
  queryTagsList();
  querySubjectList();
  getMyColumn();
});

const modalVisible = ref(false);

const goHome = () => {
  router.back();
};

const insert = (generator: InsertContentGenerator) => {
  console.log(insert);
  editorRef.value?.insert(generator);
};

const insertUrl = (str) => {
  console.log(str);
  editorRef.value?.insert(str);
};

const changeEditorType = (type: number) => {
  if (type === 2) {
    setLoading(true);
    setTimeout(() => {
      editorType.value = 1;
      postForm.editorType = 'rich';
      setLoading(false);
    }, 1500);
  } else {
    editorType.value = 2;
    postForm.editorType = 'markdown';
    setLoading(false);
  }
  postForm.content = undefined;
};

const openModal = () => {
  if (modalVisible.value) {
    modalVisible.value = false;
  } else {
    modalVisible.value = true;
  }
};

const onUploadImg = async (files: Array<File>, callback: any) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);
        editorLoading.value = true;

        defaultApi
          .uploadFile(form)
          .then((info: any) => {
            editorLoading.value = false;
            rev(info);
          })
          .catch((err) => {
            editorLoading.value = false;

            rej(err);
          });

        //   service
        //     .post(import, form, {
        //       headers: {
        //         'Content-Type': 'multipart/form-data',
        //       },
        //     })
        //     .then((info: any) => rev(info))
        //     .catch((error) => rej(error));
      });
    }),
  );

  callback(res.map((item: any) => item.data.url));
};

const toolbarConfig = {
  excludeKeys: ['uploadVideo'],
};
const editorConfig = ref({ placeholder: '请输入内容...' });

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorHtmlRef.value;
  if (editor == null) return;
  editor.destroy();
});

const uploadCoverSuccess = (fileItem: any) => {
  if (fileItem.response.data.url) {
    postForm.cover = fileItem.response.data.url;
  }
};

const handleCoverError = (fileItem: FileItem) => {
  console.log(fileItem.response);
  if (fileItem.response) {
    const { code, message } = fileItem.response;
    if (code === -1) {
      Message.error(message);
    }
  }
};

const handleCreated = (editor: any) => {
  editorHtmlRef.value = editor; // 记录 editor 实例，重要！
};

const previewTheme = ref('default');

const toolbars = ref<any>([
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'link',
  'image',
  0,
  'table',
  1,
  2,
  '-',
  'revoke',
  'next',
  '=',
  3,
  'pageFullscreen',
  'fullscreen',
  'preview',
  'catalog',
]);
const toolbarsExclude = ref<any>(['save', 'github']);

const selectTheme = (theme: string) => {
  previewTheme.value = theme;
  postForm.markdownConfig.theme = theme;
};
</script>

<style lang="scss" scoped>
.editor {
  .header {
    height: 50px;
    background: #fff;

    .title-input {
      height: 50px;
      line-height: 50px;
      // @apply text-3xl;
      background: #fff;
      width: calc(50vw - 100px);
      margin-left: 20px;
      outline: none;
      border: 0px;
    }

    :deep(.arco-input-wrapper .arco-input.arco-input-size-large) {
      font-size: 20px;
      font-weight: bold;
      // padding-left: 20px;
    }
  }

  .md-editor-block {
    height: calc(100vh - 50px);
  }
}

.demo-basic {
  padding: 10px;
  width: 200px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

:deep(.arco-radio-group-button) {
  background: #fff;

  .arco-radio-button {
    margin: 1px 1px;
    padding: 0;
    width: calc(100% - 2px);
  }
}

:deep(.md-editor-toolbar-item) {
  svg {
    width: 30px;
    height: 24px;
  }
}

.md-help {
  @apply text-sm;

  ul {
    padding-left: 0;
    color: #959da5;

    .help-content {
      float: right;
      font-size: 12px;
    }
    svg {
      width: 20px;
      height: 20px;
      @apply leading-6 h-6 mr-2 pb-1;
      display: block;
    }

    div {
      display: inline-block;
      vertical-align: top;
    }

    li {
      list-style: none;
      @apply my-5 leading-6 h-6;
    }
  }
}

.help-icon {
  padding: 2px 0;
}
.demo-arrow {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  width: 600px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
}
</style>
