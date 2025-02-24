import service from '@/api/http';
import { Author } from './default';

const postApiUrl = '/web/post';

export interface PostSerializeParams {
  current: number;
  pageSize: number;
  status?: string;
}

export interface PostColumn {
  columnId: number | string;
  name: string;
  desc: string;
  cover: string;
  status: string;
  postCount?: number;
}

export interface PostPlate {
  plateId: number;
  name: string;
  desc?: string;
}

interface markdownConfig {
  theme: string;
}

export interface PostHistory {
  content: string;
  markdownConfig: markdownConfig;
  editorType: 'markdown' | 'rich';
}

export interface PostSubject {
  subjectId: number | string;
  title: string;
  desc: string;
  cover: string;
  status?: string;
  plates: Array<PostPlate>;
}

export interface PostAuthor extends Author {
  myFollow: number;
  fanCount?: number;
  postCount?: number;
}

export interface Post {
  top: boolean;
  subjectTop: boolean;
  plateTop: boolean;
  postId: number;
  title: string;
  desc?: string;
  cover?: string;
  plateId: number;
  columnId?: number;
  subjectId: number;
  tagList?: Array<string>;
  tags?: Array<any>;
  history: Array<PostHistory>;
  subject: PostSubject;
  plates: Array<PostPlate>;
  authorId: number;
  author: PostAuthor;
  columns?: Array<PostColumn>;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  myLike: number;
}

export interface CreatePostColumnDto {
  name: string;
  desc: string;
  state?: string;
  cover?: string;
}

export interface PostColumnParams extends Partial<PostColumn> {
  current?: number;
  pageSize?: number;
}

const postApi = {
  // 标签部分
  getSubjectList: () => service.get(`${postApiUrl}/subject/list`),
  getColumnList: (params: object) => service.get(`${postApiUrl}/columns/list`, params),
  getAllColumnList: () => service.get(`${postApiUrl}/columns/list/all`),
  createColumn: (data: object) => service.post(`${postApiUrl}/columns/add`, data),
  updateColumn: (data: object) => service.post(`${postApiUrl}/columns/update`, data),
  deleteColumn: (id: number) => service.delete(`${postApiUrl}/columns/remove/${id}`),
  getColumnByCreator: (id: number) => service.get(`${postApiUrl}/columns/creator/${id}`),
  getColumn: (id: number) => service.get(`${postApiUrl}/columns/${id}`),
  // 发布帖子
  createPost: (data: object) => service.post(`${postApiUrl}/add`, data),
  updatePost: (data: object) => service.post(`${postApiUrl}/update`, data),
  // 创作者自己的帖子列表
  creatorPostList: (params: object) => service.get(`${postApiUrl}/creator/list`, params),
  // 获取帖子详情
  PostDetail: (params: object) => service.get(`${postApiUrl}/detail`, params),
  PostDetailByCreator: (params: object) => service.get(`${postApiUrl}/creator/detail`, params),
  // 发送评论
  sendPostComment: (data: object) => service.post(`${postApiUrl}/comment/send`, data),
  sendPostReply: (data: object) => service.post(`${postApiUrl}/reply`, data),
  getCommentList: (params: object) => service.get(`${postApiUrl}/comment/list`, params),
  getPostListByColumn: (params: object) => service.get(`${postApiUrl}/list/bycolumn`, params),
  getPostList: (params: object) => service.get(`${postApiUrl}/index/list`, params),
  getPostComment: (params: object) => service.get(`${postApiUrl}/comment/list`, params),
  sendLikeStatus: (data: object) => service.post(`${postApiUrl}/like`, data),
  // 获取回复列表
  getReplyList: (data: object) => service.get(`${postApiUrl}/reply/list`, data),
  // 删除帖子
  deletePost: (id: number) => service.delete(`${postApiUrl}/remove/${id}`),
  changePostStatus: (data: object) => service.post(`${postApiUrl}/change/status`, data),
};

export default postApi;
