<template>
  <div class="club-container">
    <div class="bg-white mx-auto w-full">
      <div class="h-[60px] px-[20px]">
        <span class="font-bold text-base block leading-[60px]">圈子广场</span>
      </div>
      <a-divider margin="0" />
      <div v-loading="loading" class="club-list p-[20px]">
        <div class="clubs">
          <a-tabs :active-key="selectClubIndex" type="rounded">
            <a-tab-pane v-for="club in clubList" :key="club.clubId" :title="club.name">
              <div class="themes flex flex-row flex-wrap">
                <div v-for="theme in club.themes" :key="theme.themeId" class="w-1/4 my-[20px]">
                  <div class="mr-[20px] flex flex-row hover:bg-gray-100 p-[10px]">
                    <a-avatar shape="square" :size="50"> <img :src="theme.cover" class="object-cover" /> </a-avatar>
                    <div class="ml-[10px] flex flex-col justify-between items-start">
                      <span class="text-base font-bold">{{ theme.name }}</span>
                      <div class="count">
                        <span class="text-gray-400"
                          ><span class="mr-[2px]">{{ theme.stickCount }}</span
                          >尺牍</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import stickApi from '@/api/modules/stick';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/utils/global';
import { Club } from '@/api/modules/default';

const { loading, setLoading } = useLoading();

const clubList = ref<Array<Club>>([]);

const selectClubIndex = ref();

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const clubsPagination = reactive({
  ...basePagination,
});

const fetchData = async (params = { current: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const { data } = await stickApi.getPublicStickClubList(params);
    clubsPagination.current = Number(params.current);
    clubsPagination.total = Number(data.total);
    clubList.value = data.list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

onMounted(() => {
  fetchData({ ...clubsPagination });
});
</script>

<style lang="scss" scoped>
.club-container {
  width: 1200px;
  @apply flex flex-row flex-nowrap items-start justify-between mx-auto;
}
</style>
