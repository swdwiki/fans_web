<template>
  <div>
    <a-trigger trigger="click">
      <icon-more :size="15" />
      <template #content>
        <div
          class="bg-white h-[40px] leading-[40px] flex flex-col justify-center items-center shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-[120px]"
        >
          <div @click="openReportModel">
            <icon-exclamation-circle-fill class="mr-[5px]" :size="15" />
            <span class="text-sm">举报</span>
          </div>
        </div>
      </template>
    </a-trigger>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/index';
import useHeader from '@/hooks/header';

const { headers } = useHeader();

const { userInfo, isLoginStatus } = useUserStore();

const emit = defineEmits<{
  (e: 'report'): void;
}>();

const injectHandle: any = inject('authModal');

const openReportModel = () => {
  if (isLoginStatus) {
    emit('report');
  } else {
    injectHandle.openAuthModal('login');
  }
};
</script>

<style scoped></style>
