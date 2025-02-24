<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-Cn';
import AuthModal from '@/components/InjectComponents/AuthModal.vue';
import ReportModal from '@/components/InjectComponents/ReportModal.vue';

const authModal: Ref<any> = ref(null);
const reportModal: Ref<any> = ref(null);
const locale = zhCn;

onMounted(() => {
  provide('authModal', {
    openAuthModal: (type: string) => {
      authModal.value?.openAuthModal(type);
    },
  });

  provide('reportModal', {
    openReportModal: (type: any) => {
      reportModal.value?.openReportModal(type);
    },
  });
});
</script>

<template>
  <div>
    <AuthModal ref="authModal"></AuthModal>
    <ReportModal ref="reportModal"></ReportModal>
    <a-config-provider :locale="locale">
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<style>
body {
  background: #f2f3f5;
}
</style>
