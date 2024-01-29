<template>
  <Teleport to="#app">
    <transition name="notify-fade">
      <div class="auth-modal">
        <a-modal v-model:visible="loginVisible" :footer="false" :closable="true" width="420px" :mask-closable="false">
          <template #title> 登录轩辕天书 </template>
          <div>
            <a-form ref="loginFormRef" :model="loginForm" auto-label-width size="large">
              <a-form-item
                field="account"
                label="账号"
                :rules="[{ required: true, message: '账号不能为空' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="loginForm.account" placeholder="请输入登录账号" />
              </a-form-item>
              <a-form-item
                field="password"
                label="密码"
                :validate-trigger="['change', 'input']"
                :rules="[{ required: true, message: '密码不能为空' }]"
              >
                <a-input-password v-model="loginForm.password" placeholder="请输入密码" allow-clear />
              </a-form-item>
            </a-form>
            <a-button class="w-full my-2" html-type="submit" type="primary" size="large" @click="loginSubmit"
              >登录</a-button
            >
            <div class="flex flex-row justify-between">
              <!-- <a-link>忘记密码？</a-link> -->
              <a-link @click="openAuthModal('reg')">账号注册</a-link>
            </div>
          </div>
        </a-modal>

        <a-modal
          v-model:visible="regVisible"
          :footer="false"
          :closable="true"
          width="500px"
          :mask-closable="false"
          @cancel="clearRegError"
        >
          <template #title> 账号注册 </template>
          <div>
            <a-form ref="regFormRef" :model="regForm" auto-label-width size="large" label-align="left">
              <a-form-item
                field="account"
                label="账号"
                :rules="[
                  { required: true, message: '账号不能为空' },
                  { minLength: 5, message: '账号至少为5个字符' },
                ]"
                :validate-trigger="['change', 'blur']"
              >
                <a-input v-model="regForm.account" placeholder="请输入注册账号" />
              </a-form-item>
              <a-form-item
                field="nickname"
                label="昵称"
                :rules="[{ required: true, message: '昵称不能为空' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.nickname" placeholder="请输入昵称" />
              </a-form-item>
              <a-form-item
                field="password"
                label="密码"
                :rules="[
                  { required: true, message: '密码不能为空' },
                  { minLength: 8, message: '密码长度过短，至少为8位' },
                ]"
                :validate-trigger="['change', 'blur']"
              >
                <a-input-password v-model="regForm.password" placeholder="请输入密码" allow-clear />
              </a-form-item>
              <a-form-item
                field="repsw"
                label="再次输入密码"
                :rules="[
                  { required: true, message: '密码不能为空' },
                  {
                    validator: repswValidator,
                  },
                ]"
                :validate-trigger="['change', 'input']"
              >
                <a-input-password v-model="regForm.repsw" placeholder="请再次输入密码" allow-clear />
              </a-form-item>
              <a-form-item
                field="email"
                label="绑定邮箱"
                :rules="[
                  { required: true, message: '邮箱不能为空' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.email" placeholder="请输入绑定邮箱" />
              </a-form-item>
              <a-form-item
                field="invitCode"
                label="测试邀请码"
                :rules="[{ required: true, message: '测试邀请码不能为空' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.invitCode" placeholder="请输入测试邀请码" />
              </a-form-item>
              <a-form-item
                field="code"
                label="验证码"
                :rules="[
                  { required: true, message: '验证码不能为空' },
                  { minLength: 6, maxLength: 6, message: '验证码为6位' },
                ]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.code" placeholder="请输入邮箱验证码" allow-clear>
                  <template #append>
                    <a-button
                      class="w-full"
                      :disabled="sendCodeState"
                      :type="sendCodeState !== true ? 'primary' : undefined"
                      @click="sendMailCode"
                      >{{ !sendCodeState ? '发送验证码' : String(sendCodeSecond) + '秒后重新发送' }}</a-button
                    >
                  </template>
                </a-input>
              </a-form-item>
            </a-form>
            <a-button class="w-full my-2" html-type="submit" type="primary" size="large" @click="regSubmit"
              >注册</a-button
            >
            <div class="flex flex-row justify-center">
              <a-link @click="openAuthModal('login')">账号登录</a-link>
            </div>
          </div>
        </a-modal>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import type { ValidatedError } from '@arco-design/web-vue';
import { Md5 } from 'ts-md5';
import { useRouter, useRoute } from 'vue-router';
import authApi from '@/api/modules/login';
import { useUserStore } from '@/store';

// 登录模块
const loginFormModel = () => {
  return {
    account: '',
    password: '',
  };
};

const refFormModel = () => {
  return {
    account: '',
    password: '',
    repsw: '',
    code: '',
    nickname: '',
    email: '',
    invitCode: '',
  };
};

const regVisible = ref<boolean>(false);
const loginVisible = ref<boolean>(false);

const loginFormRef = ref<any>(null);
const loginForm = ref(loginFormModel());

const regFormRef = ref<any>(null);
const regForm = ref(refFormModel());
const sendCodeState = ref(false);
const sendCodeSecond = ref(600);
const timer = ref<any>(null);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const setLoginVisiable = (state: boolean) => {
  loginVisible.value = state;
};

const setRegVisiable = (state: boolean) => {
  regVisible.value = state;
};

const loginSubmit = () => {
  loginFormRef.value.validate(async (valid: undefined | ValidatedError) => {
    if (!valid) {
      const { account, password } = loginForm.value;
      const pswMd5 = Md5.hashStr(password);
      await userStore.login({ account, password: pswMd5 });
      setLoginVisiable(false);
      router.replace({
        name: route.name as string,
        query: { ...route.query },
      });
      location.reload();
    } else {
      Message.error('登录失败');
      console.log('登录失败');
    }
  });
};

const clearRegError = () => {
  regFormRef.value.clearValidate();
};

const openAuthModal = (type: 'reg' | 'login' | 'findpsw') => {
  loginVisible.value = type === 'login';
  regVisible.value = type === 'reg';
  regVisible.value = type === 'reg';
};

const sendMailCode = () => {
  regFormRef.value.validateField(['email'], (error: any) => {
    if (!error) {
      if (!sendCodeState.value) {
        authApi.sendMailCode({ email: regForm.value.email, type: 'reg' }).then((res) => {
          if (res.code === 0 && res.data) {
            Message.success('验证码已发送，请注意查收');
            sendCodeState.value = true;
            timer.value = setInterval(() => {
              if (sendCodeSecond.value !== 0) {
                sendCodeSecond.value -= 1;
              } else {
                sendCodeSecond.value = 600;
                sendCodeState.value = false;
                clearInterval(timer.value);
              }
            }, 1000);
          }
        });
      }
    } else if (error.email) {
      Message.error(error.email.message);
    }
  });
};

const repswValidator = (value: string, callback: any) => {
  if (value !== regForm.value.password) {
    callback('与输入的密码不一致，请重新输入');
  } else {
    callback();
  }
};

const regSubmit = () => {
  regFormRef.value.validate((error: any) => {
    if (!error) {
      // console.log(regForm.value);
      const { account, password, email, code, nickname, invitCode } = regForm.value;
      const pswMd5 = Md5.hashStr(password);
      const regFormInfo = {
        account,
        email,
        password: pswMd5,
        code,
        nickname,
        invitCode,
      };
      authApi
        .accountReg({ ...regFormInfo })
        .then((res) => {
          if (res.code === 0) {
            Message.success('注册成功，即将跳转登录窗口');
            setTimeout(() => {
              openAuthModal('login');
            }, 2000);
          } else {
            Message.warning(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (error) {
      console.log(error);
      // Message.error(error.email);
    }
  });
};

defineExpose({
  openAuthModal,
  setRegVisiable,
  setLoginVisiable,
});
</script>

<style lang="scss" scoped>
:deep(.arco-input-append) {
  padding: 0;
}
</style>
