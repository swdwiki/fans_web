<template>
  <div class="post-list-wrap bg-white">
    <div class="list-header border-b-gray-600 flex flex-row flex-nowrap justify-between items-center">
      <div class="w-1/2 flex flex-row justify-start">
        <a-menu mode="horizontal" :selected-keys="[activeIndex]" @menu-item-click="changeMenu">
          <a-menu-item key="submit">最新发布</a-menu-item>
          <!-- <a-menu-item key="reply">最新回复</a-menu-item> -->
        </a-menu>
      </div>
      <div class="w-1/2 flex flex-row-reverse pr-5">
        <a-select
          v-model="selectPlateId"
          :style="{ width: '200px' }"
          placeholder="请选择分类"
          size="small"
          @change="changePlate"
        >
          <a-option :value="0" label="全部" />
          <a-option v-for="plate in props.plates" :key="plate.plateId" :label="plate.name" :value="plate.plateId" />
        </a-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import postApi from '@/api/modules/post';

const { loading, setLoading } = useLoading();

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const indexPostPagination = reactive({
  ...basePagination,
});

const activeIndex = ref('submit');
const props = defineProps({
  plates: {
    type: Array<{
      name: string;
      plateId: number | string;
    }>,
    default: () => {
      return [];
    },
  },
});

const emit = defineEmits(['selectPlates']);

const postList = ref([]);

const fetchData = async (params = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await postApi.getPostListByColumn(params);
    indexPostPagination.current = Number(params.current);
    indexPostPagination.total = Number(data.total);
    postList.value = data.list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const selectPlateId = ref<number>(0);

const changeMenu = (value: any) => {
  console.log(value);
};

const changePlate = (key: any) => {
  emit('selectPlates', key);
  selectPlateId.value = key;
};

const changePage = (page: number) => {
  indexPostPagination.current = page;
  fetchData({ ...basePagination });
};

const resetPlate = () => {
  selectPlateId.value = 0;
};

onMounted(() => {
  fetchData({
    ...indexPostPagination,
  });
});
defineExpose({
  resetPlate,
});
</script>

<style lang="scss" scoped></style>
