import service from '@/api/http';

const UPLOAD_AVATAR = import.meta.env.VITE_UPLOAD_AVATAR_URL;
const UPLOAD_FILE = import.meta.env.VITE_UPLOAD_FILE_URL;

export interface Author {
  nickname: string;
  avatar: string;
  desc?: string;
  userId: number;
  short?: string;
  followCount?: number;
  stickCount?: number;
}

export interface Images {
  url: string;
  uid?: string;
  size?: number;
}

export interface LinkBoxDto {
  title: string;
  desc: string;
  cover: string;
}

export interface reportFormDto {
  reasonId: number;
  content: string;
  imgFilesUrl: Array<Images>;
}

export interface commentReportFormDto extends reportFormDto {
  commentId: number;
}

export interface CommentDto {
  list: Array<{
    commentId: number;
    content: string;
    createdAt: string;
  }>;
  total: number;
}

export interface ReplyItemDto {
  replyId: number;
  content: string;
  replyAccount: Author;
  receivedAccount: Author;
  createdAt: string;
}

export interface ReplyDto {
  list: Array<ReplyItemDto>;
  total: number;
}

export interface CommentInfoDto {
  commentId: number;
  content: string;
  createdAt: string;
  images?: Array<string>;
  commentAccount: Author;
  replys: ReplyDto;
}

export interface StickCommentDto {
  list: Array<CommentInfoDto>;
  total: number;
}

export interface CommentItemDto {
  commentId: number;
  content: string;
  createdAt: string;
  commentAccount: Author;
  replys: {
    total: number;
    list: Array<any>;
  };
  commentAccountId: number;
}

export interface Theme {
  themeId: number;
  name: string;
  cover: string;
  desc?: string;
  stickCount: number;
}

export interface Club {
  clubId: number;
  name: string;
  desc?: string;
  themes: Array<Theme>;
}

export interface Level {
  levelId: number;
  content: string;
  level: number;
  maxExp: number;
  minExp: number;
  exp?: number;
}

export interface Task {
  addType: 'add' | 'lower';
  btnText: string;
  content: string;
  dailyTimer: number;
  exp: number;
  expRecord?: any;
  fire: number;
  fireRecord: any;
  first: boolean;
  key: string;
  router: string;
  typeId: number;
  value: string;
}

export interface FollowRecord {
  recordId: number;
  myFollow: number;
  follower: Author;
  followerId: number;
  followUserId: number;
  followUser: Author;
  status: boolean;
}

const webApiUrl = '/web';

const defaultApi = {
  // 通用接口
  follow: (data: object) => service.post(`${webApiUrl}/follow/action`, data),
  search: (params: object) => service.get(`${webApiUrl}/search`, params),
  sendReport: (data: object) => service.post(`${webApiUrl}/report/send`, data),
  getTagList: () => service.get(`${webApiUrl}/tags/list`),

  getCreatorData: () => service.get(`${webApiUrl}/user/creator/data`),
  getCreatorSubmitList: () => service.get(`${webApiUrl}/user/creator/submit/new/list`),
  getSigninList: (params: object) => service.get(`${webApiUrl}/signin/list`, params),
  signin: (data: object) => service.post(`${webApiUrl}/signin/add`, data),
  getCenterCount: () => service.get(`${webApiUrl}/user/center/signin/count`),
  supSignin: (data: object) => service.post(`${webApiUrl}/signin/supply`, data),
  centerLevel: () => service.get(`${webApiUrl}/user/center/level`),
  centerTask: () => service.get(`${webApiUrl}/user/center/growth/task`),
  centerIndexData: (params: object) => service.get(`${webApiUrl}/user/center/index/data`, params),
  centerFirstTask: () => service.get(`${webApiUrl}/user/growth/task/first`),
  //
  centerCreatorList: (params: object) => service.get(`${webApiUrl}/user/center/index/list`, params),
  changeEmail: (data: object) => service.post(`${webApiUrl}/account/change/email`, data),
  changePassword: (data: object) => service.post(`${webApiUrl}/account/change/password`, data),
  changeReadSetting: (data: object) => service.post(`${webApiUrl}/account/change/read-setting`, data),
  findPassword: (data: object) => service.post(`${webApiUrl}/account/find/password`, data),
  changeProfile: (data: object) => service.post(`${webApiUrl}/account/update/profile`, data),
  uploadFile: (data: any) => service.upload(`${UPLOAD_FILE}`, data),
  uploadAvatar: (data: any) => service.upload(`${UPLOAD_AVATAR}`, data),
  updateAvatar: (data: any) => service.post(`${webApiUrl}/account/update/avatar`, data),
  getCreatorList: (params: any) => service.get(`${webApiUrl}/user/creator/list`, params),
  getCommentCount: () => service.get(`${webApiUrl}/user/message/count`),
  getCommentsList: (params: any) => service.get(`${webApiUrl}/user/comment/list`, params),
  getReplysList: (params: any) => service.get(`${webApiUrl}/user/reply/list`, params),
  getFansList: (params: any) => service.get(`${webApiUrl}/user/fans/list`, params),
  getLikeList: (params: any) => service.get(`${webApiUrl}/user/like/list`, params),
  getExpRecordList: (params: any) => service.get(`${webApiUrl}/user/exp/record/list`, params),
  getFireRecordList: (params: any) => service.get(`${webApiUrl}/user/fire/record/list`, params),
  getFireCount: () => service.get(`${webApiUrl}/user/fire/count`),
  sendReadLikeRecord: (data: object) => service.post(`${webApiUrl}/user/like/read`, data),
  sendReadCommentRecord: (data: object) => service.post(`${webApiUrl}/user/comment/read`, data),
  sendReadFanRecord: (data: object) => service.post(`${webApiUrl}/user/fan/read`, data),
  sendReadReplyRecord: (data: object) => service.post(`${webApiUrl}/user/reply/read`, data),
};

export default defaultApi;
