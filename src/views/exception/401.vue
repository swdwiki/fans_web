<template>
  <a-row>
    <a-col>
      <a-result icon="warning" title="页面无权限" sub-title="请联系管理员申请权限">
        <template #extra>
          <a-button type="primary" @click="goBack">Back</a-button>
        </template>
      </a-result>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
const router = useRouter();
const goBack = () => {
  router.push({
    name: 'home',
  });
};
</script>
