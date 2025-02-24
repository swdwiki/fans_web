<template>
  <teleport to="#app">
    <transition name="notify-fade">
      <div class="auth-modal">
        <a-modal v-model:visible="loginVisible" :footer="false" :closable="true" width="420px" :mask-closable="false">
          <template #title> 登录轩辕天书 </template>
          <a-form ref="loginFormRef" :model="loginForm" auto-label-width size="large">
            <a-form-item
              field="email"
              label="邮箱"
              :rules="[{ required: true, message: '邮箱不能为空' }]"
              :validate-trigger="['change', 'input']"
            >
              <a-input v-model="loginForm.email" placeholder="请输入登录邮箱" />
            </a-form-item>
            <a-form-item
              field="password"
              label="密码"
              :validate-trigger="['change', 'input']"
              :rules="[{ required: true, message: '密码不能为空' }]"
              :style="{ marginBottom: '10px' }"
            >
              <div class="flex flex-col w-full items-end">
                <a-input-password v-model="loginForm.password" placeholder="请输入密码" allow-clear />
                <a-link class="mt-[5px]" @click="openAuthModal('findpsw')">忘记密码？</a-link>
              </div>
            </a-form-item>
          </a-form>
          <a-button class="w-full my-2" html-type="submit" type="primary" size="large" @click="loginSubmit"
            >登录</a-button
          >
          <div class="flex flex-row justify-center">
            <a-link @click="openAuthModal('reg')">账号注册</a-link>
          </div>
        </a-modal>

        <a-modal v-model:visible="findpswVisible" :footer="false" :closable="true" width="500px" :mask-closable="false">
          <template #title> 找回密码 </template>
          <a-form ref="findPswFormRef" :model="findPswForm" auto-label-width size="large">
            <a-form-item
              field="email"
              label="登录邮箱"
              :rules="[
                { required: true, message: '邮箱不能为空' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]"
              :validate-trigger="['change', 'input']"
            >
              <a-input v-model="findPswForm.email" placeholder="请输入登录邮箱" />
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
              <a-input v-model="findPswForm.code" placeholder="请输入邮箱验证码" allow-clear>
                <template #append>
                  <a-button
                    class="w-full"
                    :disabled="sendCodeState"
                    :type="sendCodeState !== true ? 'primary' : undefined"
                    @click="sendMailCode('findPsw')"
                    >{{ !sendCodeState ? '发送验证码' : String(sendCodeSecond) + '秒后重新发送' }}</a-button
                  >
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              field="password"
              label="新密码"
              :validate-trigger="['change', 'input']"
              :rules="[{ required: true, message: '密码不能为空' }]"
              :style="{ marginBottom: '10px' }"
            >
              <a-input-password v-model="findPswForm.password" placeholder="请输入密码" allow-clear />
            </a-form-item>
            <a-form-item
              field="repsw"
              label="再次输入新密码"
              :rules="[
                { required: true, message: '密码不能为空' },
                {
                  validator: findPswRepswValidator,
                },
              ]"
              :validate-trigger="['change', 'input']"
              :style="{ marginBottom: '10px' }"
            >
              <a-input-password v-model="findPswForm.repsw" placeholder="再次输入密码" allow-clear />
            </a-form-item>
          </a-form>
          <a-button class="w-full my-2" html-type="submit" type="primary" size="large" @click="findPswSubmit"
            >修改密码</a-button
          >
          <div class="flex flex-row justify-center">
            <a-link @click="openAuthModal('login')">账号登录</a-link>
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
                field="email"
                label="注册邮箱"
                :rules="[
                  { required: true, message: '邮箱不能为空' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.email" placeholder="请输入注册邮箱" />
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
                      @click="sendMailCode('reg')"
                      >{{ !sendCodeState ? '发送验证码' : String(sendCodeSecond) + '秒后重新发送' }}</a-button
                    >
                  </template>
                </a-input>
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
                field="nickname"
                label="昵称"
                :rules="[{ required: true, message: '昵称不能为空' }]"
                :validate-trigger="['change', 'input']"
              >
                <a-input v-model="regForm.nickname" placeholder="请输入昵称" />
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
  </teleport>
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
    email: '',
    password: '',
  };
};

const refFormModel = () => {
  return {
    password: '',
    repsw: '',
    code: '',
    nickname: '',
    email: '',
    invitCode: '',
  };
};

const findPswFormModel = () => {
  return {
    password: '',
    repsw: '',
    code: '',
    email: '',
  };
};

const findpswVisible = ref<boolean>(false);
const regVisible = ref<boolean>(false);
const loginVisible = ref<boolean>(false);

const loginFormRef = ref<any>(null);
const loginForm = ref(loginFormModel());

const findPswForm = ref(findPswFormModel());
const findPswFormRef = ref<any>(null);

const regFormRef = ref<any>(null);
const regForm = ref(refFormModel());
const sendCodeState = ref(false);
const sendCodeSecond = ref(60);
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
      const { email, password } = loginForm.value;
      const pswMd5 = Md5.hashStr(password);
      await userStore.loginByEmail({ email, password: pswMd5 });
      setLoginVisiable(false);
      router.replace({
        name: route.name as string,
        query: { ...route.query },
      });
      // eslint-disable-next-line no-restricted-globals
      location?.reload();
    } else {
      Message.error('登录失败');
      console.log('登录失败');
    }
  });
};

const openAuthModal = (type: 'reg' | 'login' | 'findpsw') => {
  loginVisible.value = type === 'login';
  regVisible.value = type === 'reg';
  findpswVisible.value = type === 'findpsw';
  sendCodeSecond.value = 60;
  sendCodeState.value = false;
  clearInterval(timer.value);
  regFormRef.value?.resetFields();
  loginFormRef.value?.resetFields();
  findPswFormRef.value?.resetFields();
};

const findPswSubmit = () => {
  findPswFormRef.value.validate(async (valid: undefined | ValidatedError) => {
    if (!valid) {
      const { email, password, code } = findPswForm.value;
      const pswMd5 = Md5.hashStr(password);
      const findPswFormInfo = {
        email,
        password: pswMd5,
        code,
      };
      authApi.findPsw({ ...findPswFormInfo }).then((res) => {
        if (res.code === 0) {
          Message.success('密码修改成功，即将跳转登录窗口');
          setTimeout(() => {
            findPswFormRef.value.resetFields();
            openAuthModal('login');
          }, 2000);
        }
      });
    } else {
      Message.error('登录失败');
      console.log('登录失败');
    }
  });
};

const clearRegError = () => {
  regFormRef.value.clearValidate();
};

const sendMailCode = (type: 'reg' | 'findPsw') => {
  (type === 'reg' ? regFormRef.value : findPswFormRef.value).validateField(['email'], (error: any) => {
    if (!error) {
      if (!sendCodeState.value) {
        authApi
          .sendMailCode({ email: type === 'reg' ? regForm.value.email : findPswForm.value.email, type })
          .then((res) => {
            if (res.code === 0 && res.data) {
              Message.success('验证码已发送，请注意查收');
              sendCodeState.value = true;
              timer.value = setInterval(() => {
                if (sendCodeSecond.value !== 0) {
                  sendCodeSecond.value -= 1;
                } else {
                  sendCodeSecond.value = 60;
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

const findPswRepswValidator = (value: string, callback: any) => {
  if (value !== findPswForm.value.password) {
    callback('与输入的密码不一致，请重新输入');
  } else {
    callback();
  }
};

const regSubmit = () => {
  regFormRef.value.validate((error: any) => {
    if (!error) {
      const { password, email, code, nickname } = regForm.value;
      const pswMd5 = Md5.hashStr(password);
      const regFormInfo = {
        email,
        password: pswMd5,
        code,
        nickname,
      };
      authApi
        .accountReg({ ...regFormInfo })
        .then((res) => {
          if (res.code === 0) {
            Message.success('注册成功，即将跳转登录窗口');
            regFormRef.value.resetFields();
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
