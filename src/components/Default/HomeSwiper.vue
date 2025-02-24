<template>
  <div class="shadow-indigo-500">
    <swiper
      :modules="options.modules"
      navigation
      effect="fade"
      :autoplay="{ delay: 5000 }"
      :pagination="{ clickable: true }"
      :loop="true"
    >
      <swiper-slide v-for="slide in props.slidesList" :key="slide.slideId" class="slider-img">
        <a :href="slide.url" target="_blank">
          <img class="slider-img rounded-lg" :src="slide.imgUrl" />
        </a>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/effect-fade';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

const options = {
  modules: [EffectFade, Autoplay, Pagination],
};

const props = defineProps({
  slidesList: {
    type: Array<{
      slideId: number;
      imgUrl: string;
      url: string;
      desc: string;
    }>,
    default: () => {
      return [
        {
          slideId: 1,
          imgUrl: 'https://s1.ax1x.com/2023/07/31/pP9Z9QP.jpg',
          url: 'https://store.steampowered.com/app/1638230/_/?curator_clanid=4777282',
        },
        // {
        //   slideId: 1,
        //   imgUrl: 'https://s1.ax1x.com/2023/08/07/pPEkmhF.jpg',
        //   url: 'https://weibo.com/7765795702/Ma8zv6pnl?pagetype=profilefeed',
        // },
      ];
    },
  },
});
</script>

<style lang="scss" scoped>
.slider-img {
  width: 920px;
  height: 274px;
  object-fit: cover;
}
</style>
