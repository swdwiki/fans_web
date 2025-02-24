<template>
  <div class="columns_list">
    <div>
      <a-modal
        v-model:visible="createOrUpdateColumnModal"
        unmount-on-close
        title="新建专栏"
        @before-ok="handleBeforeOk"
        @cancel="handleCancel"
      >
        <a-form ref="createOrUpdateColumnRef" layout="vertical" :model="createOrUpdateColumnForm">
          <a-form-item
            field="name"
            label="专栏名称"
            :rules="[
              {
                required: true,
                message: '专栏名称不能为空',
              },
            ]"
          >
            <a-input
              v-model="createOrUpdateColumnForm.name"
              placeholder="请输入专栏名称"
              :max-length="30"
              allow-clear
              show-word-limit
            />
          </a-form-item>
          <a-form-item
            field="desc"
            label="专栏介绍"
            :rules="[
              {
                required: true,
                message: '专栏名称不能为空',
              },
            ]"
          >
            <a-textarea
              v-model="createOrUpdateColumnForm.desc"
              placeholder="请输入专栏介绍"
              :auto-size="{
                minRows: 3,
                maxRows: 6,
              }"
            />
          </a-form-item>
          <a-form-item field="cover" label="专栏封面">
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
                  v-if="!createOrUpdateColumnForm.cover"
                  style="color: var(--color-text-1)"
                  class="w-[480px] h-[270px] rounded-sm flex flex-col justify-center items-center border-dashed border border-gray-400 bg-white"
                >
                  <div class="flex flex-row justify-center items-center">
                    <span class="mx-1"><icon-plus size="15" /></span>
                    <span class="mx-1 block text-base">点击上传图片</span>
                  </div>
                  <p class="h-10 leading-10 text-xs text-center text-gray-500">建议尺寸：480*270像素</p>
                </div>
                <div v-else class="w-[480px] h-[270px] rounded-sm border-dashed border border-gray-400 bg-white">
                  <img
                    :src="createOrUpdateColumnForm.cover"
                    width="480px"
                    height="270px"
                    class="object-cover w-[480px] h-[270px]"
                  />
                </div>
              </template>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div class="header">
      <div class="header-content">专栏</div>
      <div>
        <a-button type="primary" @click="openCreateOrUpdateColumnModal(false)">
          <template #icon><icon-plus /></template>
          新建专栏
        </a-button>
      </div>
    </div>
    <div class="list p-5 min-h-[700px]">
      <a-tabs :active-key="selectStatus" type="rounded" size="large" @change="changeStatusTab">
        <a-tab-pane v-for="status in statusList" :key="status.value" :title="status.label">
          <!-- <template #title> </template> -->
          <div v-if="columnsList && columnsList.length !== 0" class="flex flex-row flex-wrap">
            <a-card
              v-for="column in columnsList"
              :key="column.columnId"
              style="margin: 20px calc((100% / 3 - 30%) / 2)"
              hoverable
              :style="{ width: '30%' }"
            >
              <template #cover>
                <div
                  class="relative"
                  :style="{
                    overflow: 'hidden',
                    height: '150px',
                  }"
                >
                  <div class="absolute top-3 right-3">
                    <a-tag v-if="column.status === 'auditing'" size="small" color="#ffb400" rounded>审核中</a-tag>
                    <a-tag v-if="column.status === 'injected'" size="small" color="#f53f3f" rounded>未通过</a-tag>
                  </div>
                  <img
                    :style="{ width: '100%', height: '150px' }"
                    alt="dessert"
                    :src="
                      column.cover ||
                      'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp'
                    "
                  />
                </div>
              </template>
              <a-card-meta>
                <template #title>
                  <div class="flex flex-row flex-nowrap justify-between items-center">
                    <!-- <span class="text-base">{{ column.name }}</span> -->
                    <div>
                      <span class="text-base">{{ column.name }}</span>
                      <!-- <span class="text-xs text-gray-400 ml-2">{{ column.posts.length }}篇帖子</span> -->
                    </div>
                    <div>
                      <a-trigger position="bottom" trigger="click" auto-fit-position :unmount-on-close="false">
                        <div class="hover:bg-gray-100 p-1">
                          <icon-more />
                        </div>
                        <template #content>
                          <div class="demo-basic flex flex-col justify-center items-center">
                            <!-- <a-empty /> -->
                            <!-- <span class="block leading-9 hover:bg-gray-100 w-full text-center">管理帖子</span> -->
                            <span
                              class="block leading-9 hover:bg-gray-100 w-full text-center"
                              @click="openCreateOrUpdateColumnModal(true, column)"
                              >修改专栏</span
                            >
                            <a-popconfirm content="确定要删除该专栏么？" @ok="deleteColumn(column.columnId)">
                              <span class="block leading-9 hover:bg-gray-100 w-full text-center">删除专栏</span>
                            </a-popconfirm>
                          </div>
                        </template>
                      </a-trigger>
                    </div>
                  </div>
                </template>
                <template #description>
                  <span class="text-xs text-gray-400">{{ column.posts?.length }}篇帖子</span>
                  <div class="h-8">
                    <p class="h-full text-xs line-clamp-2 mt-2">{{ column.desc }}</p>
                  </div>
                </template>
              </a-card-meta>
            </a-card>
          </div>
          <div v-else class="flex flex-col justify-center items-center">
            <a-empty class="mt-40" description="暂无专栏"></a-empty>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FileItem, Message } from '@arco-design/web-vue';
import postApi, { PostColumnParams } from '@/api/modules/post';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import useHeader from '@/hooks/header';

const fileUploadUrl = import.meta.env.VITE_UPLOAD_FILE_URL;

interface Column {
  columnId: number;
  name: string;
  cover: string;
  desc: string;
  status: string;
  posts: Array<any>;
}

const createColumnModel = () => {
  return {
    name: '',
    cover: '',
    desc: '',
  };
};

const updateColumnModel = () => {
  return {
    ...createColumnModel(),
    columnId: '',
  };
};

const createOrUpdateColumnRef = ref<any>(null);
const { setLoading } = useLoading(true);

const route = useRoute();
const router = useRouter();
const editStatus = ref(false);
const createOrUpdateColumnModal = ref(false);
const selectStatus = ref<string>('');
const createColumnForm = ref(createColumnModel());
const createOrUpdateColumnForm = ref(updateColumnModel());
const fileList = ref<Array<FileItem>>([]);

const columnsList = ref<Array<Column>>([]);

const statusList = ref([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '已通过',
    value: 'published',
  },
  {
    label: '审核中',
    value: 'auditing',
  },
  {
    label: '未通过',
    value: 'injected',
  },
]);

const { headers } = useHeader();

const openCreateOrUpdateColumnModal = (bool: boolean, column?: any) => {
  if (bool) {
    createOrUpdateColumnModal.value = true;
    createOrUpdateColumnForm.value = { ...column };
    editStatus.value = true;
  } else {
    editStatus.value = false;
    createOrUpdateColumnModal.value = true;
  }
};

const handleCancel = () => {
  createOrUpdateColumnModal.value = false;
  editStatus.value = false;
  createColumnForm.value = createColumnModel();
  createOrUpdateColumnForm.value = updateColumnModel();
};

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const columnPagination = reactive({
  ...basePagination,
});

const fetchData = async (params: PostColumnParams = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await postApi.getColumnList(params);
    columnsList.value = data.list;
    columnPagination.current = Number(params.current);
    columnPagination.total = data.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const deleteColumn = (columnId: number) => {
  postApi
    .deleteColumn(columnId)
    .then((res: any) => {
      if (res.code === 0) Message.success('删除专栏成功');
      fetchData({ ...basePagination });
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleBeforeOk = (done: any) => {
  if (!editStatus.value) {
    createOrUpdateColumnRef.value.validate((valid: any) => {
      if (!valid) {
        const { columnId, ...addForm } = createOrUpdateColumnForm.value;
        postApi
          .createColumn({ ...addForm })
          .then((res) => {
            console.log(res);
            if (res.code === 0) {
              Message.success('创建成功');
              fetchData({ ...basePagination });
              done(true);
            } else {
              Message.error(res.message);
              done(false);
            }
          })
          .catch((err) => {
            console.log(err);
            done(false);
          });
      } else {
        done(false);
      }
    });
  } else {
    createOrUpdateColumnRef.value.validate((valid: any) => {
      if (!valid) {
        postApi
          .updateColumn({ ...createOrUpdateColumnForm.value })
          .then((res) => {
            console.log(res);
            if (res.code === 0) {
              Message.success('修改成功');
              fetchData({ ...basePagination });
              done(true);
            } else {
              Message.error(res.message);
              done(false);
            }
          })
          .catch((err: any) => {
            console.log(err);
            done(false);
          });
      } else {
        done(false);
      }
    });
  }
};

const changeStatusTab = (tab: string | number) => {
  const statusInfoIndex = statusList.value.findIndex((status: any) => status.value === tab);
  const status = statusList.value[statusInfoIndex].value;
  selectStatus.value = status;
  if (status !== 'all') {
    fetchData({ ...basePagination, status: statusList.value[statusInfoIndex].value });
  } else {
    fetchData({ ...basePagination });
  }
  router.replace({
    name: 'ColumnCreator',
    query: {
      status: statusList.value[statusInfoIndex].value,
    },
  });
};

const uploadCoverSuccess = (fileItem: any) => {
  if (fileItem.response.data.url) {
    createOrUpdateColumnForm.value.cover = fileItem.response.data.url;
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

onMounted(() => {
  const { status } = route.query;
  console.log(status, 'sss');
  if (!status)
    router.replace({
      name: 'ColumnCreator',
      query: {
        status: statusList.value[0].value,
      },
    });
  selectStatus.value = status as string;

  const statusLabel = selectStatus.value || 'all';

  if (statusLabel !== 'all') {
    fetchData({ ...basePagination, status: statusLabel });
  } else {
    fetchData({ ...basePagination });
  }
});
</script>

<style lang="scss" scoped>
.columns_list {
  @apply bg-white w-full rounded-sm;

  .header {
    @apply h-14 leading-[3.5rem] px-5 text-base font-bold border-b-gray-100 border-b flex flex-row justify-between items-center;
  }
}
.demo-basic {
  // padding: 10px;
  width: 80px;
  background-color: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
