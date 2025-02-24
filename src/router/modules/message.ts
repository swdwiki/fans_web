import { AppRouteRecordRaw } from '../types';

const MessageManager: AppRouteRecordRaw = {
  path: '/message',
  name: 'MessageManager',
  component: () => import('@/layout/MessageLayout.vue'),
  meta: {
    login: true,
    title: '消息管理',
    icon: '',
  },
  redirect: '/message/comment',
  children: [
    {
      path: 'comment',
      name: 'CommentMessage',
      component: () => import('@/views/user/message/comment.vue'),
      meta: {
        title: '我收到的评论',
        icon: '',
        login: true,
      },
    },
    {
      path: 'reply',
      name: 'ReplyMessage',
      component: () => import('@/views/user/message/reply.vue'),
      meta: {
        title: '我收到的回复',
        icon: '',
        login: true,
      },
    },
    {
      path: 'like',
      name: 'LikeMessage',
      component: () => import('@/views/user/message/like.vue'),
      meta: {
        title: '我收到的点赞',
        icon: '',
        login: true,
      },
    },
    {
      path: 'fan',
      name: 'FanMessage',
      component: () => import('@/views/user/message/fan.vue'),
      meta: {
        title: '我的新增粉丝',
        icon: '',
        login: true,
      },
    },
    {
      path: 'system',
      name: 'SystemMessage',
      component: () => import('@/views/user/message/system.vue'),
      meta: {
        title: '系统通知',
        icon: '',
        login: true,
      },
    },
  ],
};

export default MessageManager;
