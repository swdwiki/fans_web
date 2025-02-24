import service from '@/api/http';
import { Images, Author, LinkBoxDto, reportFormDto, StickCommentDto } from '@/api/modules/default';

const stickApiUrl = '/web/stick';

export interface CreateStickDto {
  content: string;
  imgList?: Array<Images>;
  link?: LinkBoxDto;
  themeId?: number;
}

export interface StickDto {
  stickId: number;
  author: Author;
  content: string;
  imgList: Array<Images>;
  link?: LinkBoxDto;
  themeId?: number;
  submitTime: string;
  comments: StickCommentDto;
  commentCount: number;
  likeCount?: number;
  replyCount?: number;
  theme: any;
  myFollow?: number;
}

export interface StickListParams {
  current: number;
  pageSize: number;
  status?: string;
}

const stickApi = {
  // 发布尺牍
  submitStick: (data: object) => service.post(`${stickApiUrl}/create`, data),
  // 获取尺牍圈子列表
  getPublicStickClubList: (params: object) => service.get(`${stickApiUrl}/club/list`, params),
  // 获取尺牍列表
  getPublicStickList: (params: object) => service.get(`${stickApiUrl}/list`, params),
  getPublicStickCommentList: (params: object) => service.get(`${stickApiUrl}/comment/list`, params),
  // 推荐列表
  getPublicStickRecommendList: () => service.get(`${stickApiUrl}/recommend`),
  // 获取尺牍详情
  getStickDetail: (params: object) => service.get(`${stickApiUrl}/detail`, params),

  // 点赞操作
  setMyLikeStick: (data: object) => service.post(`${stickApiUrl}/like`, data),

  // 评论操作
  submitStickComment: (data: object) => service.post(`${stickApiUrl}/comment`, data),
  submitStickCommentReply: (data: object) => service.post(`${stickApiUrl}/reply`, data),

  creatorStickList: (params: object) => service.get(`${stickApiUrl}/creator/list`, params),
  deleteStick: (stickId: number) => service.delete(`${stickApiUrl}/delete/${stickId}`),
  // 获取某个评论的回复
  getStickCommentReply: (params: object) => service.get(`${stickApiUrl}/comment/reply/list`, params),
};

export default stickApi;
