import { defineStore } from 'pinia';

const useAuthStore = defineStore({
  // 这里的id必须为唯一ID
  id: 'auth',
  state: () => {
    return {
      loginVisibleModal: false,
      regVisibleModal: false,
    };
  },
  // 等同于vuex的getter
  getters: {
    loginVisible: (state) => state.loginVisibleModal,
    regVisible: (state) => state.regVisibleModal,
  },
  // pinia 放弃了 mutations 只使用 actions
  actions: {
    // actions可以用async做成异步形式
    openAuthModal(type: string) {
      console.log(type, 'type');
      this.loginVisibleModal = type === 'login';
      this.regVisibleModal = type === 'reg';
      console.log(this.loginVisible, 'loginVisible');
    },
    setLoginModal(bool: boolean) {
      this.loginVisibleModal = bool;
    },
    setRegModal(bool: boolean) {
      this.regVisibleModal = bool;
    },
  },
});

export default useAuthStore;
