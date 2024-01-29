import { AppRouteRecordRaw } from '../types';

const CreatorCenter: AppRouteRecordRaw = {
  path: '/creator',
  name: 'CreatorCenter',
  component: () => import('@/layout/creator/Layout.vue'),
  meta: {
    login: true,
    title: '创作者中心',
    icon: '',
  },
  redirect: '/creator/home',
  children: [
    {
      path: 'home',
      name: 'CreatorHome',
      component: () => import('@/views/creator/index.vue'),
      meta: {
        title: '首页-创作者中心',
        icon: '',
        login: true,
      },
    },
    {
      path: 'posts',
      name: 'PostsCreator',
      component: () => import('@/views/creator/posts.vue'),
      meta: {
        title: '文章管理-创作者中心',
        icon: '',
        login: true,
      },
    },
    {
      path: 'column',
      name: 'ColumnCreator',
      component: () => import('@/views/creator/columns.vue'),
      meta: {
        title: '专栏管理-创作者中心',
        icon: '',
        login: true,
      },
    },
    {
      path: 'stick',
      name: 'SticksCreator',
      component: () => import('@/views/creator/stick.vue'),
      meta: {
        title: '专栏管理-创作者中心',
        icon: '',
        login: true,
      },
    },
    {
      path: 'question',
      name: 'QuestionCreator',
      component: () => import('@/views/creator/question.vue'),
      meta: {
        title: '常见问题-创作者中心',
        icon: '',
        login: true,
      },
    },
    // {
    //   // QuestionCreator
    // },

    // {
    //   path: 'monitor',
    //   name: 'Monitor',
    //   component: () => import('@/views/dashboard/monitor/index.vue'),
    //   meta: {
    //     locale: 'menu.dashboard.monitor',
    //     requiresAuth: true,
    //     roles: ['admin'],
    //   },
    // },
  ],
};

export default CreatorCenter;
