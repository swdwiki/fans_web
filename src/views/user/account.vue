<template>
  <div class="account-setting min-h-[600px]">
    <a-modal v-model:visible="emailModal" @before-ok="changeEmail" @cancel="cancel('email')">
      <template #title>邮箱换绑</template>
      <a-form ref="changeEmailRef" :model="changeEmailForm" auto-label-width>
        <a-form-item
          field="email"
          label="原邮箱"
          extra="如原邮箱无法收到验证码，请联系管理员手动修改邮箱"
          :rules="[{ required: true, message: '原邮箱不能为空' }]"
        >
          <a-input v-model="changeEmailForm.email" placeholder="请输入原邮箱" disabled></a-input>
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
          <a-input v-model="changeEmailForm.code" placeholder="请输入邮箱验证码" allow-clear>
            <template #append>
              <a-button
                class="w-full"
                :disabled="sendCodeState"
                :type="sendCodeState !== true ? 'primary' : undefined"
                @click="sendMailCode('changeMail')"
                >{{ !sendCodeState ? '发送验证码' : String(sendCodeSecond) + '秒后重新发送' }}</a-button
              >
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="新邮箱" :rules="[{ required: true, message: '新邮箱不能为空' }]">
          <a-input v-model="changeEmailForm.newemail" placeholder="请输入要更换的新邮箱"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="passwordModal" @before-ok="changePassword" @cancel="cancel('password')">
      <template #title>修改密码</template>
      <a-form ref="changePasswordRef" :model="changePasswordForm" auto-label-width>
        <a-form-item
          field="email"
          label="验证邮箱"
          extra="如原邮箱无法收到验证码，请联系管理员手动修改邮箱"
          :rules="[{ required: true, message: '验证邮箱不能为空' }]"
        >
          <a-input
            v-model="changePasswordForm.email"
            placeholder="请输入验证邮箱"
            :disabled="changePasswordForm.email ? true : false"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="code"
          label="验证码"
          :rules="[
            { required: true, message: '验证码不能为空' },
            { minLength: 6, maxLength: 6, message: '验证码为6位' },
          ]"
          :validate-trigger="['blur', 'change', 'focus', 'input']"
        >
          <a-input
            v-model="changePasswordForm.code"
            placeholder="请输入邮箱验证码"
            allow-clear
            :validate-trigger="['blur', 'change', 'focus', 'input']"
          >
            <template #append>
              <div class="w-full">
                <a-button
                  :disabled="sendCodeState"
                  :type="sendCodeState !== true ? 'primary' : undefined"
                  long
                  @click="sendMailCode('changePsw')"
                  >{{ !sendCodeState ? '发送验证码' : String(sendCodeSecond) + '秒后重新发送' }}</a-button
                >
              </div>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          label="原密码"
          :rules="[{ required: true, message: '原密码不能为空' }]"
          :validate-trigger="['blur', 'change', 'focus', 'input']"
        >
          <a-input-password v-model="changePasswordForm.password" placeholder="请输入原密码" allow-clear />
        </a-form-item>
        <a-form-item
          field="newpass"
          label="新密码"
          :rules="[{ required: true, message: '新密码不能为空' }]"
          :validate-trigger="['blur', 'change', 'focus', 'input']"
        >
          <a-input-password v-model="changePasswordForm.newpass" placeholder="请输入新密码" allow-clear />
        </a-form-item>
        <a-form-item
          field="twicepass"
          label="再次输入新密码"
          :rules="[
            { required: true, message: '再次输入的密码不能为空' },
            {
              validator: twicePsw,
            },
          ]"
          :validate-trigger="['blur', 'change', 'focus', 'input']"
        >
          <a-input-password v-model="changePasswordForm.twicepass" placeholder="请再次输入新密码" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
    <div class="head h-[60px] flex flex-row justify-between items-center px-[20px] bg-white">
      <span class="text-base font-bold">账号设置</span>
    </div>
    <div class="px-[20px]">
      <a-divider margin="0" />
      <div class="flex flex-row justify-between items-center h-[60px] leading-[60px]">
        <div class="">
          <span class="">邮箱</span>
          <span class="ml-[20px] text-gray-400">{{ userInfo.email }}</span>
        </div>
        <div class="right">
          <a-link @click="openChangeEmailModel">换绑</a-link>
        </div>
      </div>
      <a-divider margin="0" />
      <div class="flex flex-row justify-between items-center h-[60px] leading-[60px]">
        <div class="">
          <span class="">密码</span>
        </div>
        <div class="right">
          <a-link @click="openChangePasswordModel">修改</a-link>
        </div>
      </div>
      <a-divider margin="0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { Md5 } from 'ts-md5';
import { useRouter } from 'vue-router';
import defaultApi from '@/api/modules/default';
import authApi from '@/api/modules/login';
import { useUserStore } from '@/store';

const router = useRouter();

const { userInfo, logout } = useUserStore();
const changeEmailRef = ref<any>(null);
const changePasswordRef = ref<any>(null);

const changeEmailForm = reactive({
  email: userInfo.email,
  code: '',
  newemail: '',
});

const changePasswordForm = reactive({
  email: userInfo.email,
  code: '',
  password: '',
  newpass: '',
  twicepass: '',
});

const emailModal = ref(false);
const passwordModal = ref(false);
const sendCodeState = ref(false);

const sendCodeSecond = ref(60);
const timer = ref<any>(null);

const cancel = (type: string) => {
  if (type === 'email') {
    changeEmailRef.value.clearValidate();
    changeEmailRef.value.resetFields();
  } else if (type === 'password') {
    changePasswordRef.value.clearValidate();
    changePasswordRef.value.resetFields();
  }
};

const openChangeEmailModel = () => {
  changeEmailForm.email = userInfo.email as string;
  emailModal.value = true;
};

const openChangePasswordModel = () => {
  // changePasswordForm.pas
  changePasswordForm.email = userInfo.email as string;

  passwordModal.value = true;
};

const twicePsw = (value: string, cb: any) => {
  if (value !== changePasswordForm.newpass) {
    cb('两次密码输入不一致');
  } else {
    cb();
  }
};
const changeEmail = (done: any) => {
  changeEmailRef.value.validate((valid: any) => {
    if (!valid) {
      defaultApi
        .changeEmail({
          ...changeEmailForm,
        })
        .then((res) => {
          console.log(res);
          done(true);
        })
        .catch((err) => {
          done(false);
        });
    } else {
      done(false);
    }
  });
};

const changePassword = (done: any) => {
  changePasswordRef.value.validate((valid: any) => {
    if (!valid) {
      const { password, newpass, twicepass, ...form } = changePasswordForm;

      if (newpass !== twicepass) {
        done(false);
        Message.error('两次输入的新密码不一致，请检查后再提交');
      } else {
        const pswMd5 = Md5.hashStr(password);
        defaultApi
          .changePassword({
            ...form,
            password: pswMd5,
            newpass: Md5.hashStr(newpass),
          })
          .then((res) => {
            if (res.code === 0) {
              done(true);
              Message.success('密码修改成功，账号即将登出');
              setTimeout(() => {
                router.replace({ name: 'home' });
                logout();
                location.reload();
              }, 2000);
            } else {
              Message.error(res.message || '密码修改失败');
              done(false);
            }
          })
          .catch((err) => {
            done(false);
          });
      }
    } else {
      done(false);
    }
  });
};

const sendMailCode = (type: string) => {
  changeEmailRef.value.validateField(['email'], (error: any) => {
    if (!error) {
      if (!sendCodeState.value) {
        authApi.sendMailCode({ email: changeEmailForm.email, type }).then((res) => {
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
</script>

<style scoped></style>
