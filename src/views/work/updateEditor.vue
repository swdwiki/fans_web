<template>
  <div class="work-editor-continar">
    <a-modal
      v-model:visible="updateStausVisible"
      :hide-cancel="true"
      :footer="false"
      :closable="false"
      :mask-closable="false"
    >
      <template #title> 编辑同人作品 </template>
      <div class="flex flex-col justify-center items-center">
        <div class="flex flex-row justify-center items-center mb-[30px]">
          <div class="text-green-600 font-bold">
            <icon-check size="30" />
          </div>
          <span class="text-base font-bold">更新成功</span>
        </div>
        <div class="handle flex flex-row justify-around items-center">
          <a-button type="primary" class="mx-[10px]" @click="gotoUrl('workDetail', { param: route.params.workId })"
            >查看作品详情</a-button
          >
          <a-button type="outline" status="normal" class="mx-[10px]" @click="gotoUrl('home')">返回首页</a-button>
          <a-button type="outline" status="normal" class="mx-[10px]" @click="gotoUrl('WorkCreator')"
            >返回创作者中心</a-button
          >
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model:visible="uploadImagesVisible"
      :hide-cancel="true"
      :footer="true"
      :ok-text="uploadImagesVisible ? '上传图片' : '取消'"
      :closable="false"
      :mask-closable="false"
      :unmount-on-close="true"
      @before-ok="submitImagesUpload"
    >
      <template #title> 图片上传 </template>
      <div>
        <a-upload
          ref="uploadImgsRef"
          :multiple="true"
          list-type="picture-card"
          :action="fileUploadUrl"
          image-preview
          accept="image/*,"
          name="files"
          :headers="headers"
          :file-list="fileList"
          :auto-upload="false"
          @before-upload="beforeUpload"
        />
      </div>
    </a-modal>

    <a-modal
      :visible="showRulesVisible"
      width="80%"
      :hide-cancel="true"
      @ok="showRulesVisible = false"
      @cancel="showRulesVisible = false"
    >
      <template #title> 投稿规则 </template>
      <div class="h-[500px]">
        <div class="pb-[20px]">
          <a-typography>
            <a-typography-title :heading="5"> 「 同人创作投稿规则 」</a-typography-title>
            <a-typography-paragraph spacing="default">
              1. 当前阶段同人作品发布无需审核即可发布成功，所发即所得，可自由发布社区规则范围下的任何内容；<br />
              2. 同人作品内容不得涉及任何政治、赌博、毒品等内容，不得涉及国家和地区违法内容；<br />
              3. 不得发布游戏(包括但不限轩辕剑系列)或轩辕剑相关影视作品破解及盗版资源、信息；<br />
              4. 不得寻求游戏(包括但不限轩辕剑系列)或轩辕剑相关衍生作品破解及盗版资源、索要激活码等；<br />
              5.
              不得恶意诋毁、无由抹黑、内涵游戏(包括但不限轩辕剑系列)、游戏制作人、游戏代理商等官方人员及组织（包括衍生作品）。<br />
              6. 不得针对游戏，衍生作品或与其它游戏作品恶意对比进行挑拨、引战，不得针对游戏，衍生作品或其他问题钓鱼；<br />
            </a-typography-paragraph>
            <a-typography-title :heading="5"> 「 18+&G向内容 」</a-typography-title>
            <a-typography-paragraph spacing="default">
              1. 目前社区允许发布轩辕剑<strong>（可联动其他游戏（因暂时未取得相关方的授权，仙剑奇侠传除外））</strong>的
              18
              +内容，发布内容仅限于当下限定的18+范围（范围见【注】），发布范围仅限于小说、同人绘、声音相关（同人剧）虚拟素材创作，禁止发布任何非轩辕剑或不含轩辕剑、以及真人（包括
              cosplay）相关18+内容；<br />
              <a-typography-text bold type="danger"
                >（注：目前18+不限制范围，包括G向均可，但是建议不能过度暴露（即性器官特别明显），请自行注意尺度，后续会根据社区投票来决定是否限定g向）</a-typography-text
              ><br />
              2. 如果需要发布 18+ 内容，请在发布作品之前，主动勾选「该内容包含 18
              禁内容」的选项，发布后，会在作品列表页自动马赛克且通过标志明确告知，避免其他用户浏览时产生不必要的麻烦。<br />
              3. 如果发布 18+ 内容且没有主动勾选 18+
              选项，经管理员确认后，会对该内容进行调整，并扣除同内容级别的黑火积分，三次存在该情况，则对其进行 3
              个月的禁言，禁言阶段禁止发布任何内容，后续每新增一次，增加 1 个月的禁言时效性，多达 9
              次及以上则账号永久封禁，并扣除全部黑火积分。<br />
              4. 正常同人作品列表不会显示18+内容，如对 18+感兴趣，可在个人设置里设置开启，可放心食用。<br />
              5.
              后续如因监管或其他原因导致相关内容限制或禁止发布与展示，会对其内容进行清理，当前阶段请务必珍惜讨论环境。<br />
            </a-typography-paragraph>
            <a-typography-title :heading="5"> 「 关于AI创作内容 」</a-typography-title>
            <a-typography-paragraph spacing="default">
              由于当下AI创作下的版权保护法规还不完善，存在大量侵权、喂图等行为，为了维护大眼蛙的创作权利，本社区严禁任何AI创作的作品的提交与发布，一经查实，禁言90天，严重者封号并收回社区权益；
            </a-typography-paragraph>
          </a-typography>
        </div>
      </div>
    </a-modal>
    <!-- 步骤条 -->
    <div class="submit-form">
      <a-form
        ref="workEditorRef"
        :model="submitWorkForm"
        class=""
        auto-label-width
        layout="vertical"
        :rules="formRules"
      >
        <div class="form-wrap">
          <div class="work-detail">
            <div class="input-editor">
              <a-form-item field="title" :hide-label="true" :required="true" :hide-asterisk="false">
                <input
                  v-model="submitWorkForm.title"
                  type="text"
                  placeholder="请输入作品名称"
                  class="bg-white h-[50px] leading-[50px] text-base px-[10px] w-full border-gray-300 border-b"
                />
              </a-form-item>
              <a-form-item field="content" :hide-label="true" :required="true" :hide-asterisk="false">
                <div class="editor">
                  <Toolbar
                    id="updateEditor"
                    style="border-bottom: 1px solid #ccc"
                    :editor="updateEditorRef"
                    :default-config="toolbarConfig"
                  />
                  <Editor
                    v-model="submitWorkForm.content"
                    style="height: 500px; overflow-y: hidden"
                    :default-config="editorConfig"
                    @onCreated="handleCreated"
                  />
                </div>
              </a-form-item>
            </div>
          </div>
          <div class="work-options">
            <div class="mb-[60px] p-[20px]">
              <a-alert type="warning" class="mb-[20px]">
                <div class="flex flex-row justify-between items-center px-[10px]">
                  <span>投稿之前务必了解投稿规则</span>
                  <a-button type="text" class="ml-[5px]" @click="showRulesVisible = true">投稿规则</a-button>
                </div>
              </a-alert>
              <a-form-item label="封面图" field="cover" :label-col-style="labelStyle">
                <a-upload
                  :action="fileUploadUrl"
                  :multiple="false"
                  accept="image/*,"
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="headers"
                  :draggable="true"
                  @success="uploadCoverSuccess"
                  @error="handleCoverError"
                >
                  <template #upload-button>
                    <div
                      v-if="submitWorkForm.cover"
                      class="upload-cover relative"
                      @mouseover="showMask = true"
                      @mouseleave="showMask = false"
                    >
                      <img class="upload-cover-img upload-cover" :src="submitWorkForm.cover" />
                      <div
                        v-if="showMask && submitWorkForm.cover"
                        class="text-white flex flex-col justify-center items-center h-full absolute w-full left-[0] bg-black bg-opacity-40 top-0"
                      >
                        <IconEdit size="30" />
                        <span class="text-sm text-center mt-[20px]">点击重新上传封面</span>
                      </div>
                      <!-- <div class="arco-upload-list-picture-mask">
                        <IconEdit />
                      </div> -->
                    </div>
                    <div v-else class="upload-cover-box upload-cover">
                      <div class="w-full h-full flex flex-col justify-center items-center">
                        <IconPlus />
                        <div style="margin-top: 10px; font-weight: 600">上传封面图</div>
                      </div>
                    </div>
                  </template>
                </a-upload>
              </a-form-item>
              <a-form-item label="作品分类" field="cateIds" :label-col-style="labelStyle">
                <a-cascader
                  v-model="submitWorkForm.cateIds"
                  :path-mode="true"
                  :options="workCateList"
                  :field-names="{ value: 'cateId', label: 'name', children: 'children' }"
                  value-key="cateId"
                  placeholder="请选择作品分类"
                  @change="selectWorkCate"
                />
              </a-form-item>
              <a-form-item field="tagList" label="标签" :label-col-style="labelStyle">
                <a-select
                  v-model="submitWorkForm.tagList"
                  placeholder="请选择或输入标签"
                  :allow-create="true"
                  multiple
                  :limit="5"
                  value-key="name"
                >
                  <template #header>
                    <span class="text-sm leading-8 h-8 text-gray-600 ml-5"
                      >最多只能选择或输入5个标签，已选择或输入{{
                        submitWorkForm.tagList && submitWorkForm.tagList.length
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
              <a-form-item v-if="showR18OptionStatus" label="含18+内容" field="isR18" :label-col-style="labelStyle">
                <a-switch v-model="submitWorkForm.isR18" :checked-value="true" :unchecked-value="false">
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </a-switch>
              </a-form-item>
              <a-form-item
                v-if="submitWorkForm.isR18"
                label="含G向内容"
                field="isGrotesque"
                extra="G向内容通常指猎奇向同人风格。这种风格通常包含一些极具冲击力的情节，如断肢、腰斩、暴力堕胎、挖出内脏等"
                :label-col-style="labelStyle"
              >
                <a-switch v-model="submitWorkForm.isGrotesque" :checked-value="true" :unchecked-value="false">
                  <template #checked> 是 </template>
                  <template #unchecked> 否 </template>
                </a-switch>
              </a-form-item>
            </div>
          </div>
        </div>
      </a-form>
      <div class="bottom-bar">
        <div class="read-rule-radio">
          <a-checkbox v-model="readRuleStatus" :value="true">已了解并清楚同人作品投稿规则，并已遵守投稿规则</a-checkbox>
        </div>
        <div class="handle-btns">
          <!-- <a-button :loading="saveLoading" size="large" status="warning" class="mx-[10px]" @click="saveWork"
              >保存草稿</a-button
            > -->
          <a-button
            :loading="submitLoading"
            type="primary"
            size="large"
            class="mx-[10px]"
            :disabled="!readRuleStatus"
            @click="updateWork"
            >作品更新</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive } from 'vue';
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
import { IToolbarConfig, SlateElement } from '@wangeditor-next/editor';
import { FileItem, Message } from '@arco-design/web-vue';
import workApi from '@/api/modules/work';
import useLoading from '@/hooks/loading';
import defaultApi from '@/api/modules/default';
import useHeader from '@/hooks/header';
import { useUserStore } from '@/store';
import '@wangeditor-next/editor/dist/css/style.css'; // 引入 css

type VideoElement = SlateElement & {
  src: string;
  poster?: string;
};

const updateEditorRef = shallowRef();
const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

const showRulesVisible = ref(false);
const updateStausVisible = ref(false);

type InsertFnType = (url: string, alt: string, href: string) => void;

const fileList = ref([]);
const { headers } = useHeader();
const workEditorRef = ref();
const showMask = ref(false);

const uploadImagesVisible = ref(false);
const uploadImgsList = ref([]);

// 内容 HTML

const labelStyle = reactive({
  fontWeight: 'bold',
});

onBeforeUnmount(() => {
  const editor = updateEditorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const { loading, setLoading } = useLoading();
const { loading: submitLoading, setLoading: setSubmitLoading } = useLoading();
const { userInfo } = useUserStore();
const route = useRoute();
const router = useRouter();

const workCateList = ref<any>([]);

const tagsList = ref<Array<any>>([]);

const readRuleStatus = ref(false);
const showR18OptionStatus = ref(false);

const submitWorkForm = ref({
  title: '',
  cateIds: [],
  content: '',
  cover: '',
  desc: '',
  tagList: [],
  isR18: false,
  isGrotesque: false,
});

// 自定义校验视频
function customCheckVideoFn(src: string): boolean | string | undefined {
  // TS 语法
  if (!src) {
    return;
  }
  if (src.indexOf('http') !== 0) {
    // return '视频地址必须以 http/https 开头';
    Message.error('视频地址必须以 http/https 开头');
    return '视频地址必须以 http/https 开头';
  }
  return true;

  // 返回值有三种选择：
  // 1. 返回 true ，说明检查通过，编辑器将正常插入视频
  // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
  // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
}

// 自定义转换视频
function customParseVideoSrc(src: string): string {
  // TS 语法
  // function customParseVideoSrc(src) {               // JS 语法
  if (src.includes('.bilibili.com')) {
    // 转换 bilibili url 为 iframe （仅作为示例，不保证代码正确和完整）
    const arr = new URL(src).pathname.split('/');
    return `<iframe src="//player.bilibili.com/player.html?bvid=${arr[2]}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="800" height="400" style="width: 100%; height: 500px; max-width: 100%；align:center; padding:20px 0;"> </iframe>`;
  }
  return src;
}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    insertVideo: {
      onInsertedVideo(videoNode: VideoElement | null) {
        // TS 语法
        // onInsertedVideo(videoNode) {                    // JS 语法
        if (videoNode == null) return;
        const { src } = videoNode;
        console.log('inserted video', src);
      },
      checkVideo: customCheckVideoFn, // 也支持 async 函数
      parseVideoSrc: customParseVideoSrc, // 也支持 async 函数
    },
    uploadImage: {
      server: fileUploadUrl,
      allowedFileTypes: ['image/*'],
      timeout: 5 * 1000, // 5 秒
      fieldName: 'file',
      headers: headers.value,
      onSuccess(file: File, res: any) {
        // TS 语法
        // onSuccess(file, res) {          // JS 语法
        console.log(`${file.name} 上传成功`, res);
      },
      onError(file: File, err: any, res: any) {
        // TS 语法
        // onError(file, err, res) {               // JS 语法
        console.log(`${file.name} 上传出错`, err, res);
      },
      customInsert(res: any, insertFn: InsertFnType) {
        // TS 语法
        // customInsert(res, insertFn) {                  // JS 语法
        // res 即服务端的返回结果
        console.log(res);

        const { url } = res.data;
        // 从 res 中找到 url alt href ，然后插入图片
        console.log(url);
        insertFn(url, submitWorkForm.value.title || userInfo.nickname || '', url);
      },
    },
  },
};

const checkHtml = (htmlContent: string) => {
  // 使用正则表达式匹配图片src链接
  const imgSrcs = htmlContent.match(/<img[^>]+src="([^">]+)"/g);
  let imgSrcContent = '';
  if (imgSrcs) {
    // 将匹配到的图片src链接拼接成字符串
    imgSrcs.forEach((src) => {
      imgSrcContent += `${src?.match(/"([^">]+)"/)[1]} `;
    });
  }

  // 使用正则表达式去掉所有html标签，但保留标签中的文字
  const textContent = htmlContent.replace(/<[^>]+>/g, (match) => {
    // 如果是图片标签，则返回空字符串，因为图片src已经单独处理过了
    if (match.startsWith('<img')) {
      return '';
    }
    // 对于其他标签，只保留标签中的文字
    return match.replace(/<[^>]*>|<\/[^>]*>/g, '');
  });

  // 将图片src链接字符串与去掉标签后的文本内容拼接
  const finalContent = imgSrcContent.trim() + textContent.trim();

  // 判断处理后的内容是否为空
  return finalContent.length > 0;
};

const formRules = ref<any>({
  title: [
    {
      required: true,
      message: '请输入作品名称',
    },
  ],
  cover: [
    {
      required: true,
      message: '请上传作品封面',
    },
  ],
  cateIds: [
    {
      type: 'array',
      minLength: 2,
      message: '请完整选择分类',
    },
  ],
  content: [
    {
      required: true,
      validator: (value: string, cb: any) => {
        return new Promise((resolve) => {
          if (!checkHtml(value)) {
            cb('请完善作品内容');
          }
          resolve(true);
        });
      },
    },
  ],
});

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'codeBlock',
    'fontFamily',
    'fullScreen',
    'formatPainter',
    'emotion',
    'group-more-style',
    'bulletedList',
    'numberedList',
    'todo',
    'undo',
    'redo',
  ],
  toolbarKeys: [
    'headerSelect',
    'blockquote',
    '|',
    'bold',
    'underline',
    'italic',
    'color',
    'bgColor',
    '|',
    'fontSize',
    'lineHeight',
    '|',
    'insertLink',
    'upLoadImagesButton',
    // 'insertImage',
    // 'uploadImage',
    'insertVideo',
    'insertTable',
    'divider',
  ],
};

const gotoUrl = (url: string, param?: any) => {
  console.log(param);
  router.replace({
    name: url,
    params: param,
  });
};

const selectWorkCate = (value: any) => {
  const res = workCateList.value.find((cate: any) => cate.cateId === value[0]);
  const findSonCate = res.children.find((son: any) => son.cateId === value[1]);
  if (findSonCate) {
    if (findSonCate.needCover) {
      formRules.value.cover = [
        {
          required: true,
          message: '请上传作品封面',
        },
      ];
    } else {
      formRules.value.cover = [];
    }
    showR18OptionStatus.value = findSonCate.r18;
  }
};

const queryTagsList = () => {
  defaultApi.getTagList().then((res) => {
    if (res.code === 0) {
      tagsList.value = res.data;
    }
  });
};

const getWorkDetail = (workId: number) => {
  workApi
    .getDetailByCreator(workId)
    .then((res) => {
      if (res.code === 0) {
        submitWorkForm.value = res.data;
        const { parentCate } = res.data;
        showR18OptionStatus.value = parentCate.r18;
      }
    })
    .catch((err) => {
      console.log(err);
      // Message.error(err.message);
      if (err.status === 404) {
        router.replace({
          name: 'CreatorHome',
        });
      }
    });
};

const beforeUpload = (file) => {
  uploadImgsList.value.push(file);
  return true;
};

const submitImagesUpload = (done: any) => {
  if (uploadImgsList.value && uploadImgsList.value.length === 0) {
    Message.error('请选择图片');
    done(false);
    return;
  }
  defaultApi
    .uploadFiles(uploadImgsList.value)
    .then((res) => {
      if ((res as any).code === 0) {
        Message.success('上传成功');
        uploadImgsList.value = [];
        // uploadImgsRef.value.clear();
        fileList.value = [];
        uploadImagesVisible.value = false;
        const result = res.data
          .map((item: any) => `<img style="width:100%;height:100%;" src="${item.url}" />`)
          .join('');
        done(true);
        updateEditorRef.value?.setHtml(updateEditorRef.value.getHtml() + result);
      } else {
        done(false);
      }
    })
    .catch((err) => {
      done(false);
    });
};

const openUploadImagesModal = () => {
  uploadImagesVisible.value = true;
};

const getWorkCateList = () => {
  // TODO
  setLoading(true);
  workApi
    .queryCateList()
    .then((res) => {
      if (res.code === 0) {
        workCateList.value = res.data.list;
      }
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
};

const handleCreated = (editor: any) => {
  editor.uploadImageModal = openUploadImagesModal;
  updateEditorRef.value = editor; // 记录 editor 实例，重要！
};

const uploadCoverSuccess = (fileItem: any) => {
  if (fileItem.response.data.url) {
    submitWorkForm.value.cover = fileItem.response.data.url;
  }
};

// const saveWork = () => {
//   setSaveLoading(true);
//   workEditorRef.value.validateField(['title', 'content'], (valid: any) => {
//     if (!valid) {
//       workApi
//         .saveWork({
//           ...submitWorkForm.value,
//         })
//         .then((res) => {
//           if (res.code === 0) {
//             Message.success('发布成功');
//             // router.push({ path: '/work/list' });
//           } else {
//             Message.error(res.message);
//           }
//           setSaveLoading(false);
//         });
//     } else {
//       Object.values(valid).forEach((err: any) => {
//         Message.error(err.message);
//       });
//       setSaveLoading(false);
//     }
//   });
// };

const updateWork = () => {
  setSubmitLoading(true);
  workEditorRef.value.validate((valid: any) => {
    if (!valid) {
      workApi
        .updateWork({
          ...submitWorkForm.value,
        })
        .then((res) => {
          setSubmitLoading(false);
          if (res.code === 0) {
            Message.success('更新成功');
            updateStausVisible.value = true;
          } else {
            updateStausVisible.value = false;
            Message.error(res.message);
          }
        })
        .catch((err: any) => {
          console.log(err);
          setSubmitLoading(false);
        });
    } else {
      Object.values(valid).forEach((err: any) => {
        Message.error(err.message);
      });
      setSubmitLoading(false);
    }
  });
};

const handleCoverError = (fileItem: FileItem) => {
  if (fileItem.response) {
    const { code, message } = fileItem.response;
    if (code === -1) {
      Message.error(message);
    }
  }
};

onMounted(() => {
  queryTagsList();
  getWorkCateList();
  getWorkDetail(Number(route.params.id));
});
</script>

<style lang="scss" scoped>
.work-editor-continar {
  @apply w-full mt-[80px] bg-white;
  height: calc(100vh - 80px);

  .form-wrap {
    @apply flex flex-row;

    .work-detail {
      height: calc(100vh - 80px);
      @apply w-[70%];

      .input-editor {
        @apply pt-[20px] w-[80%] mx-auto;

        .editor {
          @apply mt-[20px] text-base;
        }
      }
    }

    .work-options {
      @apply w-[30%] border-l border-l-gray-100 overflow-scroll;
      height: calc(100vh - 140px);
    }
  }

  .submit-form {
    @apply h-full;

    .select-type-wrap {
      @apply w-[500px] mx-auto mt-[50px];
    }

    .add-content-wrap {
      @apply w-full mx-auto mt-[100px];
    }
  }
}

.bottom-bar {
  @apply w-full h-[60px] bg-white fixed bottom-0 left-0 flex flex-row justify-around items-center;
  box-shadow: -5px 0px 10px rgba($color: #000000, $alpha: 0.3);
}

input[type='text']:focus {
  outline: 0px;
}

.upload-cover {
  @apply w-[300px] h-[225px];
}

.upload-cover-box {
  @apply bg-gray-100 border border-dashed border-gray-300;
}
.upload-cover-img {
  @apply object-cover;
}
</style>
