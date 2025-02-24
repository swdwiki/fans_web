import { AppRouteRecordRaw } from '../types';

const DefaultRouter: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
      icon: '',
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/sticks',
    name: 'stick',
    meta: {
      title: '尺牍',
      icon: '',
    },
    component: () => import('@/views/stick/index.vue'),
  },
  {
    path: '/search',
    name: 'SearchResult',
    meta: {
      title: '搜索结果',
      icon: '',
    },
    component: () => import('@/views/search/index.vue'),
  },
  // {
  //   path: '/sticks/clubs',
  //   name: 'clubs',
  //   meta: {
  //     title: '圈子广场',
  //     icon: '',
  //   },
  //   component: () => import('@/views/stick/club/club.vue'),
  // },
  {
    path: '/sticks/:id',
    name: 'stickDetail',
    meta: {
      title: '尺牍详情',
      icon: '',
    },
    component: () => import('@/views/stick/detail.vue'),
  },
  {
    path: '/work/editor',
    name: 'workEditor',
    meta: {
      title: '同人作品发布',
      icon: '',
      login: true,
    },
    component: () => import('@/views/work/editor.vue'),
  },
  {
    path: '/work/editor/update/:id',
    name: 'updateWorkEditor',
    meta: {
      title: '同人作品更新',
      icon: '',
      login: true,
    },
    component: () => import('@/views/work/updateEditor.vue'),
  },
  {
    path: '/works/:id',
    name: 'workDetail',
    meta: {
      title: '同人作品详情',
      icon: '',
    },
    component: () => import('@/views/work/detail.vue'),
  },
  // {
  //   path: '/sticks/clubs/:clubId',
  //   name: 'clubDetail',
  //   meta: {
  //     title: '圈子详情',
  //     icon: '',
  //   },
  //   component: () => import('@/views/stick/club/detail.vue'),
  // },
  // {
  //   path: '/activity',
  //   name: 'activity',
  //   meta: {
  //     title: '活动',
  //     icon: '',
  //   },
  //   component: () => import('@/views/stick/sticks.vue'),
  // },
  {
    path: '/work',
    name: 'work',
    meta: {
      title: '同人工坊',
      icon: '',
    },
    component: () => import('@/views/work/index.vue'),
  },
  {
    path: '/app',
    name: 'app',
    meta: {
      title: '轩辕天书App下载',
      icon: '',
    },
    component: () => import('@/views/app/index.vue'),
  },
  // {
  //   path: '/links',
  //   name: 'link',
  //   meta: {
  //     title: '天书导航',
  //     icon: '',
  //   },
  //   component: () => import('@/views/stick/sticks.vue'),
  // },
  // {
  //   path: '/links',
  //   name: 'links',
  //   meta: {
  //     title: '友情链接',
  //     icon: '',
  //   },
  //   component: () => import('@/views/home/index.vue'),
  // },
  // {
  //   path: '/system',
  //   name: 'system',
  //   meta: {
  //     title: '平台制度',
  //     icon: '',
  //   },
  //   component: () => import('@/views/home/index.vue'),
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: {
  //     title: '关于我们',
  //     icon: '',
  //   },
  //   component: () => import('@/views/home/index.vue'),
  // },
  // {
  //   path: '/feedback',
  //   name: 'feedback',
  //   meta: {
  //     title: '意见反馈',
  //     icon: '',
  //   },
  //   component: () => import('@/views/home/index.vue'),
  // },
  {
    path: '/column/:columnId',
    name: 'UserColumn',
    meta: {
      title: '专栏',
      icon: '',
    },
    component: () => import('@/views/column/index.vue'),
  },
  {
    path: '/post/:postId',
    name: 'PostDetail',
    meta: {
      title: '帖子详情',
      icon: '',
    },
    component: () => import('@/views/post/detail.vue'),
  },
];

export default DefaultRouter;
