// 需要鉴权的业务路由
import { RouteRecordRaw } from 'vue-router';
import appRoutes from './modules';

const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'default',
    component: () => import('@/layout/DefaultLayout.vue'),
    redirect: '/',
    children: [...appRoutes],
  },
  {
    path: '/editor',
    name: 'editor',
    meta: {
      title: '写帖子',
      icon: '',
      login: true,
    },
    component: () => import('@/views/user/editor.vue'),
  },
  // {
  //   path: '/work/editor',
  //   name: 'workEditor',
  //   meta: {
  //     title: '同人投稿',
  //     icon: '',
  //     login: true,
  //   },
  //   component: () => import('@/views/work/editor.vue'),
  // },
  {
    path: '/editor/update/:id',
    name: 'updateEditor',
    meta: {
      title: '帖子编辑',
      icon: '',
      login: true,
    },
    component: () => import('@/views/user/updateEditor.vue'),
  },

  // {
  //   path: '/process',
  //   name: 'process',
  //   meta: {
  //     title: 'Template configuration process',
  //     icon: '',
  //   },
  //   component: () => import('@/views/example/MarkdownPage.vue'),
  // },
];

export default asyncRoutes;
