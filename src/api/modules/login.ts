import service from '@/api/http';

const authApiUrl = '/web/account';

export interface LoginData {
  account: string;
  password: string;
}

const authApi = {
  // 验证登录实例
  // postVerification: (params: object) => service.post(`/login`, params),
  accountReg: (data: object) => service.post(`${authApiUrl}/reg`, data),
  sendMailCode: (data: object) => service.post(`${authApiUrl}/getcode`, data),
  accountLogin: (data: object) => service.post(`${authApiUrl}/login`, data),
  accountUserInfo: () => service.get(`${authApiUrl}/userinfo`),
};

export default authApi;
