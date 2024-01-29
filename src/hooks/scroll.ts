import { ref, onMounted, onUnmounted } from 'vue';
import { throttle } from 'lodash';

export default function useSroll(elRef: any) {
  // 默认监听window上的scroll事件
  let el: any = window;
  const isBottom = ref(false); // 是否触底
  const scrollHeight = ref(0); // 可滚动区域的高
  const scrollTop = ref(0); // 已经滚动区域的高
  const clientHeight = ref(0); // 可视区高度

  // 使用lodash实现节流效果
  const scroll = throttle(() => {
    if (!elRef) {
      scrollHeight.value = document.documentElement.scrollHeight;
      scrollTop.value = document.documentElement.scrollTop;
      clientHeight.value = document.documentElement.clientHeight;
    } else {
      scrollHeight.value = el.scrollHeight;
      scrollTop.value = el.scrollTop;
      clientHeight.value = el.clientHeight;
    }
    // 以滚动高度 + 当前视口高度  >= 可滚动高度 = 触底
    if (scrollTop.value + clientHeight.value >= scrollHeight.value) {
      isBottom.value = true;
    }
  }, 100);

  // 页面初始化注册scroll事件
  onMounted(() => {
    // dom 挂载时判断外界是否传入dom实例
    if (elRef) el = elRef.value;
    el.addEventListener('scroll', scroll);
  });

  // 页面销毁时移除scroll事件
  onUnmounted(() => {
    el.removeEventListener('scroll', scroll);
  });

  return {
    isBottom,
    scrollHeight,
    scrollTop,
    clientHeight,
  };
}
