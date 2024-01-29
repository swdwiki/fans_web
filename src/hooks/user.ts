import { useRouter, useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';

import { useUserStore } from '@/store';

export default function useUser() {
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
  const logout = async () => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success('登出成功');
    if (route.name === 'home') {
      router.replace({
        name: 'home',
      });
      location.reload();
    } else {
      router.replace({
        name: 'home',
      });
    }
  };
  return {
    logout,
  };
}
