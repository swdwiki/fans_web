<template>
  <div class="message-container">
    <div class="message-box pt-[100px]">
      <a-empty description="暂无系统通知" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.message-container {
  .top-nav-bar {
    @apply min-h-[50px] max-h-[100px] bg-white w-full shadow-lg top-[60px] fixed left-0 z-[100];
    box-shadow: inset 0 5px 15px -10px rgba($color: #000000, $alpha: 0.2);
    .nav-list {
      @apply h-[50px] mx-auto w-[960px] 2xl:w-[1200px] flex flex-row justify-center items-center;
      .nav-item {
        @apply text-sm text-center text-gray-500 mx-[30px] cursor-pointer leading-[50px];
      }
      .nav-selected {
        @apply text-blue-600 font-bold;
      }
    }

    .child-nav-list {
      @apply h-[30px] mx-auto w-[960px] 2xl:w-[1200px] flex flex-row justify-center items-center;
      .nav-item {
        @apply text-[12px] text-center text-gray-500 mx-[30px] cursor-pointer leading-[30px];
      }
      .nav-selected {
        @apply text-blue-600 font-bold;
      }
    }
  }
  .message-box {
    @apply w-[960px] 2xl:w-[1200px]  bg-white min-h-[400px] mx-auto mt-[150px];
  }
}

.fan-card {
  margin: 0 calc(10% / 4);
  @apply w-[45%] flex flex-row justify-between items-center px-[15px] my-[10px] border border-gray-200 rounded-sm py-[15px];
}

.like-card {
  @apply flex flex-row justify-between items-center px-[20px] pb-[10px] my-[10px] rounded-sm border-b border-gray-100;
}

.child-top-nav {
  @apply h-[50px] leading-[50px] flex flex-row justify-center items-center border-b border-gray-100;
  .child-nav {
    @apply w-1/3 block text-center cursor-pointer relative hover:font-bold hover:text-blue-600;

    &:hover::after {
      content: '';
      @apply block h-[3px] w-[60%] bg-blue-600 mx-auto absolute bottom-0 left-[20%];
    }
  }
}
</style>
