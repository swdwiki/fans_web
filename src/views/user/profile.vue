<template>
  <div class="user_profile">
    <a-modal
      v-model:visible="changeAvatarModal"
      width="700px"
      ok-text="更换头像"
      unmount-on-close
      @before-ok="changeAvatar"
    >
      <template #title>更换头像</template>
      <div>
        <a-row>
          <a-col :span="16" style="height: 300px">
            <vue-cropper
              ref="cropperRef"
              :img="options.img"
              :info="true"
              :can-move-box="options.canMoveBox"
              :fixed="options.fixed"
              :auto-crop="options.autoCrop"
              :auto-crop-width="options.autoCropWidth"
              :auto-crop-height="options.autoCropHeight"
              :fixed-box="options.fixedBox"
              :output-type="options.outputType"
              :fixed-number="options.fixedNumber"
              :center-box="options.centerBox"
              @crop-moving="cropMoving"
              @img-moving="imgMoving"
              @mousewheel="mousewheel"
            />
          </a-col>
          <a-col v-if="previews.data.url" :span="8" class="flex flex-col justify-center items-center h-full">
            <span>头像预览：</span>
            <img :src="previews.data.url" class="rounded-[50%] w-[100px] h-[100px]" />
            <a-upload
              :auto-upload="false"
              action="#"
              :show-file-list="false"
              class="my-[10px]"
              @before-upload="beforeUpload"
            >
              <template #upload-button>
                <a-button size="small" type="primary">重新上传文件</a-button>
              </template>
            </a-upload>
          </a-col>
        </a-row>
        <a-row class="mt-[15px]">
          <a-col :span="24">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-button long @click="changeScale(1)">
                  <template #icon><icon-zoom-in /></template>
                  放大
                </a-button>
              </a-col>
              <a-col :span="6">
                <a-button long @click="changeScale(-1)">
                  <template #icon><icon-zoom-out /></template>缩小</a-button
                >
              </a-col>
              <a-col :span="6">
                <a-button long @click="rotateLeft()">
                  <template #icon><icon-undo /></template>向左旋转</a-button
                >
              </a-col>
              <a-col :span="6">
                <a-button long @click="rotateRight()">
                  <template #icon><icon-redo /></template>向右旋转</a-button
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <div class="header">
      <span>个人资料</span>
    </div>
    <div class="profile_card">
      <div class="card_left float-left">
        <span class="text-base font-bold block pt-5">基础信息</span>
        <div class="profile_form">
          <a-form ref="profileRef" :model="profileUpdateForm" auto-label-width>
            <a-form-item
              field="nickname"
              label="大眼蛙昵称"
              :rules="[
                {
                  required: true,
                  message: '请输入大眼蛙昵称',
                },
              ]"
            >
              <a-input
                v-model="profileUpdateForm.nickname"
                placeholder="请输入大眼蛙昵称"
                show-word-limit
                max-length="20"
                @input="changeInput"
              />
            </a-form-item>
            <a-form-item field="desc" label="关于我" extra="在帖子、尺牍和同人作品个人卡片上展示">
              <a-textarea
                v-model="profileUpdateForm.short"
                placeholder="十五个字以内介绍自己"
                show-word-limit
                max-length="15"
                allow-clear
                :auto-size="{
                  minRows: 1,
                  maxRows: 1,
                }"
                @input="changeInput"
              />
            </a-form-item>
            <a-form-item field="desc" label="详细介绍" extra="用于在个人页面展示，禁止透露个人隐私信息">
              <a-textarea
                v-model="profileUpdateForm.desc"
                placeholder="请输入自我详细介绍"
                show-word-limit
                max-length="200"
                allow-clear
                :auto-size="{
                  minRows: 4,
                  maxRows: 8,
                }"
                @input="changeInput"
              />
            </a-form-item>
          </a-form>

          <a-button :loading="loading" type="primary" :disabled="changeProfile" size="large" @click="saveProfile"
            >保存修改</a-button
          >
        </div>
      </div>
      <div class="card_right flex flex-col items-center pt-10">
        <a-avatar :size="80" class="mx-auto w-[100px] h-[100px]">
          <img :src="userInfo.avatar" />
        </a-avatar>
        <a-upload
          ref="uploadRef"
          :auto-upload="false"
          :action="fileUploadUrl"
          :show-file-list="false"
          class="my-[10px]"
          @before-upload="beforeUpload"
        >
          <template #upload-button>
            <a-button size="small" type="primary">更换头像</a-button>
          </template>
        </a-upload>
        <span class="text-xs text-gray-400 leading-6">支持jpg(jpeg)、gif,文件大小5M以内</span>
      </div>
    </div>
    <!-- <div class="address_list w-full float-left my-5">
  <div class="flex flex-row items-center justify-start mb-2">
        <span class="text-base font-bold block mr-5">奖品收货信息</span>
        <a-button type="text" class="address_edit" @click="openCreateOrUpdateModal(false)">添加收货信息</a-button>
      </div>
      <div class="list">
        <a-list :bordered="true">
          <a-list-item v-for="idx in 4" :key="idx">
            <a-list-item-meta>
              <template #title>
                <span class="text-sm">黑龙江省 牡丹江市 西安区 沿江街道华隆城市花园1号楼1单元704室</span>
              </template>
              <template #description>
                <span class="text-gray-500 text-xs">王天洋 17745302854</span>
              </template>
            </a-list-item-meta>
            <template #actions>
              <div class="text-gray-500 text-xs" @click="openCreateOrUpdateModal(true)">
                <icon-edit class="mx-1" />
                <span>编辑</span>
              </div>
              <a-popconfirm content="确认删除该地址？">
                <div class="text-gray-500 text-xs">
                  <icon-delete class="mx-1" />
                  <span>删除</span>
                </div>
              </a-popconfirm>
            </template>
          </a-list-item>
        </a-list>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref, reactive } from 'vue';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import defaultApi from '@/api/modules/default';
import { base64toFile } from '@/utils/format';

const { userInfo, infoSync } = useUserStore();

const { loading, setLoading } = useLoading();

const options: any = reactive({
  img: null, // 裁剪图片的地址
  autoCropWidth: 200, // 默认生成截图框宽度 默认容器的 80%
  autoCropHeight: 200, // 默认生成截图框高度 默认容器的 80%
  outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
  autoCrop: true, // 是否默认生成截图框
  fixedBox: false, // 固定截图框大小
  centerBox: false,
  fixed: true,
  fixedNumber: [1, 1],
  canMoveBox: true,
});

const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

const cropperRef = ref<any>(null);
const profileRef = ref<any>(null);
const changeProfile = ref(true);
const uploadRef = ref();
const previews = ref({
  style: {
    width: '',
    height: '',
    overflow: '',
    margin: '0',
    zoom: 0,
  },
  data: {
    url: '',
    img: '',
    html: '',
  },
});

const profileUpdateForm = ref({
  ...userInfo,
});

const uploadAvatar = ref({
  size: 0,
  name: '',
  type: '',
});

const getCropData = () => {
  cropperRef.value.getCropData((data: any) => {
    // do something
    previews.value.data.url = data;
  });
};

const changeScale = (num: number) => {
  cropperRef.value.changeScale(num || 1);
  getCropData();
};
// 向左边旋转90度
const rotateLeft = () => {
  cropperRef.value.rotateLeft();
  getCropData();
};
// 向右边旋转90度
const rotateRight = () => {
  cropperRef.value.rotateRight();
  getCropData();
};

const changeAvatarModal = ref(false);

const uploadFile = (file: any): any => {
  // 创建一个FormData对象
  const formData = new FormData();
  formData.append('file', file, file.name);

  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    defaultApi
      .uploadAvatar(formData)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
};

const changeAvatar = async (done: any) => {
  cropperRef.value.getCropData(async (data: any) => {
    const file = base64toFile(data, uploadAvatar.value.name, uploadAvatar.value.type);
    uploadFile(file)
      .then((res: any) => {
        if (res.code === 0) {
          defaultApi
            .updateAvatar({
              avatar: res.data.url,
            })
            .then((re: any) => {
              if (re.code === 0) {
                Message.success('头像更换成功');
                infoSync();
                done(true);
                location.reload();
              }
            })
            .catch((err) => {
              console.log(err);
              done(false);
            });
        } else {
          done(false);
        }
      })
      .catch((err: any) => {
        done(false);
      });
  });
};

const changeInput = () => {
  changeProfile.value = false;
};

const saveProfile = () => {
  profileRef.value.validate((valid: any) => {
    if (!valid) {
      setLoading(true);
      const { nickname, desc, short } = profileUpdateForm.value;
      defaultApi
        .changeProfile({
          nickname,
          desc,
          short,
        })
        .then((res) => {
          if (res.code === 0) {
            Message.success('用户信息修改成功');
            setLoading(false);
            infoSync();
            location.reload();
          } else {
            Message.error(res.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  });
};

const beforeUpload = (rawFile: File) => {
  if (rawFile.type.indexOf('image/') === -1) {
    Message.error('请上传图片类型文件!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    Message.error('文件大小不能超过2MB!');
    return false;
  }
  if (rawFile.type.indexOf('image/gif') !== -1) {
    // // uploadRef.value.submit();
    // uploadRef.value.upload(rawFile);
    uploadFile(rawFile).then((res: any) => {
      if (res.code === 0) {
        defaultApi
          .updateAvatar({
            avatar: res.data.url,
          })
          .then((re: any) => {
            if (re.code === 0) {
              Message.success('头像更换成功');
              infoSync();
              location.reload();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        Message.error(res.message);
      }
    });
  } else {
    const reader = new FileReader();
    reader.readAsDataURL(rawFile);
    reader.onload = () => {
      // 图片在这里
      options.img = reader.result;
      changeAvatarModal.value = true;
    };

    // console.log(rawFile, 'rawFile');
    const { size, name, type } = rawFile;

    uploadAvatar.value = {
      size,
      name,
      type,
    };
  }

  // // return true;
  // return true;
};

const cropMoving = () => {
  getCropData();
};

const imgMoving = () => {
  getCropData();
};
const mousewheel = () => {
  getCropData();
};
</script>

<style lang="scss" scoped>
.user_profile {
  .header {
    @apply border-b border-b-gray-200 h-[50px] leading-[50px] font-bold px-[20px] text-base;
  }
  .profile_card {
    // @apply flex flex-row justify-between items-start;
    .card_left {
      @apply w-2/3 px-5;
      .profile_form {
        @apply py-5;
      }
    }
    .card_right {
      @apply float-right w-1/3;
    }
  }

  .address_list {
    @apply w-full px-5;
  }
}

.avatar-container {
  .img-box {
    border-radius: 50%;
    border: 1px solid #ccc;
    width: 10vw;
    height: 10vw;
  }
}
// .preview-box {
//   // position: absolute;
//   // top: 50%;
//   // transform: translate(50%, -50%);
//   width: 200px;
//   height: 200px;
//   border-radius: 50%;
//   border: 1px solid #ccc;
//   overflow: hidden;
// }
</style>
