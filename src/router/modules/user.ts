import { AppRouteRecordRaw } from '../types';

const UserRouter: Array<AppRouteRecordRaw> = [
  {
    path: '/u/:id',
    name: 'UserHome',
    meta: {
      title: '个人主页',
      icon: '',
    },
    component: () => import('@/views/user/index.vue'),
  },
  {
    path: '/user/setting',
    name: 'UserSetting',
    meta: {
      login: true,
      title: '用户设置',
      icon: '',
    },
    redirect: '/user/setting/profile',
    component: () => import('@/layout/user/Layout.vue'),
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        meta: {
          login: true,
          title: '个人主页',
          icon: '',
        },
        component: () => import('@/views/user/profile.vue'),
      },
      {
        path: 'account',
        name: 'UserAccount',
        meta: {
          login: true,
          title: '账号设置',
          icon: '',
        },
        component: () => import('@/views/user/account.vue'),
      },
      {
        path: 'common',
        name: 'UserCommon',
        meta: {
          login: true,
          title: '通用设置',
          icon: '',
        },
        component: () => import('@/views/user/common.vue'),
      },
    ],
  },
  {
    path: '/user/center',
    name: 'UserCenter',
    meta: {
      login: true,
      title: '用户中心',
      icon: '',
    },
    redirect: '/user/center/signin',
    component: () => import('@/layout/user/CenterLayout.vue'),
    children: [
      {
        path: 'signin',
        name: 'UserSignin',
        meta: {
          login: true,
          title: '每日签到',
          icon: '',
        },
        component: () => import('@/views/user/center/sign.vue'),
      },
      {
        path: 'growth',
        name: 'UserLevel',
        meta: {
          login: true,
          title: '成长等级',
          icon: '',
        },
        component: () => import('@/views/user/center/level.vue'),
      },
      {
        path: 'score',
        name: 'ScoreDetail',
        meta: {
          login: true,
          title: '我的经验值',
          icon: '',
        },
        component: () => import('@/views/user/center/score.vue'),
      },
      {
        path: 'welfare',
        name: 'UserWelfare',
        meta: {
          login: true,
          title: '黑火兑换',
          icon: '',
        },
        component: () => import('@/views/user/center/welfare.vue'),
      },
      {
        path: 'fire',
        name: 'FireDetail',
        meta: {
          login: true,
          title: '我的黑火能量',
          icon: '',
        },
        component: () => import('@/views/user/center/fire_record.vue'),
      },
      {
        path: 'lottery',
        name: 'UserLottery',
        meta: {
          login: true,
          title: '洞天宝盒——抽奖',
          icon: '',
        },
        component: () => import('@/views/user/center/lottery.vue'),
      },
    ],
  },
];

export default UserRouter;
