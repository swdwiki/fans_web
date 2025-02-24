<template>
  <Teleport to="#app">
    <transition name="notify-fade">
      <div class="auth-modal">
        <a-modal v-model:visible="reportVisible" @before-ok="submitReportSubmit" @cancel="reportModalCancel">
          <template #title> 举报反馈 </template>
          <a-form ref="reportFormRef" :model="reportForm" auto-label-width layout="vertical">
            <a-form-item
              field="reasonId"
              :label="`请选择举报/投诉${typeOptions[reportType].label}的原因`"
              :rules="[
                {
                  required: true,
                  message: '请选择举报/投诉帖子的原因',
                },
              ]"
            >
              <a-radio-group v-model="reportForm.reasonId">
                <div class="flex flex-row flex-wrap justify-start items-center">
                  <div v-for="(reason, index) in typeOptions[reportType].reasonList" :key="index" class="py-3 w-[25%]">
                    <a-radio :value="reason?.reasonId">
                      <template #radio="{ checked }">
                        <a-tag :checked="checked" color="arcoblue" size="large" checkable>{{ reason.label }}</a-tag>
                      </template>
                    </a-radio>
                  </div>
                </div>
              </a-radio-group>
            </a-form-item>
            <a-form-item field="content" label="补充说明">
              <template #extra>
                <p>内容抄袭类别需要说明原创内容来源和抄袭内容的具体说明。</p>
              </template>
              <a-textarea
                v-model="reportForm.content"
                allow-clear
                max-length="500"
                :show-word-limit="true"
                placeholder="请输入举报/投诉相关补充说明"
                :auto-size="{
                  minRows: 4,
                  maxRows: 8,
                }"
              ></a-textarea>
            </a-form-item>
            <a-form-item
              field="imgLists"
              label="补充说明图片"
              extra="你可以上传相关证据或涉及举报内容具体位置的图片，帮助管理员更快地核实处理"
            >
              <a-upload
                v-model="reportForm.imgFilesUrl"
                accept="image/*,"
                name="file"
                :headers="headers"
                list-type="picture-card"
                multiple
                :limit="5"
                :action="fileUploadUrl"
                :default-file-list="fileList"
                image-preview
                @success="uploadCoverSuccess"
                @before-remove="removeCover"
                @error="handleCoverError"
                @before-upload="beforeUpload"
              />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { FileItem, Message, ValidatedError } from '@arco-design/web-vue';
import useHeader from '@/hooks/header';
import defaultApi, { reportFormDto } from '@/api/modules/default';

const { headers } = useHeader();
const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

const fileList = ref<Array<FileItem>>([]);

const typeOptions = ref<any>({
  post: {
    label: '帖子',
    reasonList: [
      {
        label: '低俗色情',
        reasonId: 1,
      },
      {
        label: '内容抄袭',
        reasonId: 2,
      },
      {
        label: '涉嫌违法',
        reasonId: 3,
      },
      {
        label: '内容涉政',
        reasonId: 4,
      },
      {
        label: '恶意营销',
        reasonId: 5,
      },
      {
        label: '引战',
        reasonId: 6,
      },
      {
        label: '内容质量差',
        reasonId: 7,
      },
      {
        label: '辱骂他人',
        reasonId: 8,
      },
      {
        label: '其他原因',
        reasonId: 99,
      },
    ],
  },
  stick: {
    label: '尺牍',
    reasonList: [
      {
        label: '低俗色情',
        reasonId: 1,
      },
      {
        label: '内容抄袭',
        reasonId: 2,
      },
      {
        label: '涉嫌违法',
        reasonId: 3,
      },
      {
        label: '内容涉政',
        reasonId: 4,
      },
      {
        label: '恶意营销',
        reasonId: 5,
      },
      {
        label: '引战',
        reasonId: 6,
      },
      {
        label: '辱骂他人',
        reasonId: 8,
      },
      {
        label: '其他原因',
        reasonId: 99,
      },
    ],
  },
  work: {
    label: '同人作品',
    reasonList: [
      {
        label: '低俗色情',
        reasonId: 1,
      },
      {
        label: '内容抄袭',
        reasonId: 2,
      },
      {
        label: '涉嫌违法',
        reasonId: 3,
      },
      {
        label: '内容涉政',
        reasonId: 4,
      },
      {
        label: '恶意营销',
        reasonId: 5,
      },
      {
        label: '引战',
        reasonId: 6,
      },
      {
        label: '内容质量差',
        reasonId: 7,
      },
      {
        label: '辱骂他人',
        reasonId: 8,
      },
      {
        label: '夹带私货',
        reasonId: 9,
      },
      {
        label: '其他原因',
        reasonId: 99,
      },
    ],
  },
  comment: {
    label: '评论/回复',
    reasonList: [
      {
        label: '低俗色情',
        reasonId: 1,
      },
      {
        label: '涉嫌违法',
        reasonId: 3,
      },
      {
        label: '内容涉政',
        reasonId: 4,
      },
      {
        label: '恶意营销',
        reasonId: 5,
      },
      {
        label: '引战',
        reasonId: 6,
      },
      {
        label: '辱骂他人',
        reasonId: 8,
      },
      {
        label: '夹带私货',
        reasonId: 9,
      },
      {
        label: '其他原因',
        reasonId: 99,
      },
    ],
  },
});

const reportFormModel = () => {
  return {
    content: '',
    reasonId: 0,
    imgFilesUrl: [],
  };
};

const reportVisible = ref<boolean>(false);

const reportFormRef = ref<any>(null);
const reportForm = ref<reportFormDto>(reportFormModel());
const reportType = ref('post');

const reportModalCancel = () => {
  reportVisible.value = false;
  reportForm.value = reportFormModel();
  fileList.value = [];
};

const submitReportSubmit = (done: any) => {
  reportFormRef.value.validate(async (valid: undefined | ValidatedError) => {
    if (!valid) {
      defaultApi
        .sendReport({
          ...reportForm.value,
        })
        .then((res: any) => {
          if (res.code === 0) {
            Message.success('投诉/举报成功');
            reportFormRef.value.resetFields();
            fileList.value = [];
            reportForm.value = reportFormModel();
            done(true);
          } else {
            Message.error(res.message || '');
            done(false);
          }
        })
        .catch((err) => {
          console.log(err);
          done(false);
        });
    } else {
      Message.error('登录失败');
      console.log('登录失败');
      done(false);
    }
  });
};

const uploadCoverSuccess = (fileItem: FileItem) => {
  fileList.value.push(fileItem);
  const { data } = fileItem.response;
  if (data && data.url) {
    reportForm.value.imgFilesUrl.push(data);
  }
};

const removeCover = (fileItem: FileItem): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const indexs = fileList.value.findIndex((file: any) => {
      return file.uid === fileItem.uid;
    });
    fileList.value.splice(indexs, 1);
    reportForm.value.imgFilesUrl.splice(indexs, 1);
    resolve(true);
  });
};

const handleCoverError = (fileItem: FileItem) => {
  fileList.value.push(fileItem);
  if (fileItem.response) {
    const { code, message } = fileItem.response;
    if (code === -1) {
      Message.error(message);
    }
  }
};

const openReportModal = (reportInfo: any) => {
  const { type, ...info } = reportInfo;
  reportVisible.value = true;
  reportType.value = type;
  reportForm.value = {
    ...info,
    ...reportFormModel(),
    type,
  };
};

const beforeUpload = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (file.size > 5242880) {
      reject(new Error('文件大小已超出5M'));
    } else {
      resolve(true);
    }
  });
};

defineExpose({
  openReportModal,
});
</script>

<style lang="scss" scoped>
:deep(.arco-input-append) {
  padding: 0;
}
</style>
