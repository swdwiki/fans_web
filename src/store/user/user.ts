import { defineStore } from 'pinia';
import { Message } from '@arco-design/web-vue';
import { UserInfoState } from './type';
import authApi, { LoginData, LoginByMailData } from '@/api/modules/login';
import { clearToken, getToken, setToken } from '@/utils/token';

const useUserStore = defineStore('userinfo', {
  state: (): UserInfoState => ({
    nickname: undefined,
    avatar: undefined,
    uuid: undefined,
    desc: undefined,
    accountId: undefined,
    email: undefined,
    short: undefined,
    userId: undefined,
    exp: undefined,
    fire: undefined,
    level: undefined,
    count: undefined,
    todaySign: false,
    isR18: false,
    isGrotesque: false,
  }),
  // 等同于vuex的getter
  getters: {
    userInfo(state: UserInfoState): UserInfoState {
      return { ...state };
    },
    isLoginStatus(): boolean {
      const accessToken = getToken();
      return Boolean(accessToken);
    },
  },
  // pinia 放弃了 mutations 只使用 actions
  actions: {
    // actions可以用async做成异步形式
    async login(loginForm: LoginData) {
      try {
        const { data } = await authApi.accountLogin(loginForm);
        const { accessToken } = data;
        setToken(accessToken);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    async loginByEmail(loginForm: LoginByMailData) {
      try {
        const { data } = await authApi.accountLoginByEmail({
          ...loginForm,
          loginType: 'web',
        });
        const { accessToken } = data;
        setToken(accessToken);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    setInfo(partial: Partial<UserInfoState>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },
    async infoSync() {
      try {
        const { data } = await authApi.accountUserInfo();
        this.setInfo(data);
      } catch (err) {
        console.log(err);
        this.logout();
        Message.error('登录凭证已过期，请重新登录');
      }
    },
    logout() {
      this.resetInfo();
      clearToken();
    },
  },
});

export default useUserStore;
