import service from '@/api/http';
import { Author } from './default';

const workApiUrl = '/web/works';

export interface WorkCate {
  cateId: number;
  name: string;
  parentId: number;
  level: number;
  children?: Array<WorkCate>;
}

export interface WorkHistory {
  historyId?: number;
  content: string;
  markdownConfig?: any;
  editorType: 'markdown' | 'rich';
}

export interface Works {
  title: string;
  desc?: string;
  cover: string;
  status: string;
  workId: number;
  author: Author;
  cate: WorkCate;
  parentCate: WorkCate;
  cateId: number;
  parentCateId: number;
  isR18: boolean;
  isGrotesque: boolean;
  history: Array<WorkHistory>;
}

export interface WorkItem {
  title: string;
  desc?: string;
  cover: string;
  status: string | number;
  workId: number;
  author: Author;
  cate: WorkCate;
  parentCate: WorkCate;
  cateId: number;
  parentCateId: number;
  isR18: boolean;
  isGrotesque: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  replyCount?: number;
  history?: Array<WorkHistory>;
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
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  myLike: number;
}

export interface CreatePostSerializeDto {
  name: string;
  desc: string;
  state?: string;
  cover?: string;
}

export interface WorkParams {
  current?: number;
  pageSize?: number;
  cateId?: number;
  parentCateId?: number;
  isR18?: boolean;
  isGrotesque?: boolean;
}

const workApi = {
  // 分类
  queryCateList: () => service.get(`${workApiUrl}/cate/list`),
  queryWorkList: (data: WorkParams) => service.post(`${workApiUrl}/list`, data),
  // queryWorkListByCreator: (params: WorkParams) => service.get(`${workApiUrl}/creator/list`, { params }),
  getWorkDetail: (id: number) => service.get(`${workApiUrl}/detail/${id}`),
  submitWork: (data: object) => service.post(`${workApiUrl}/create`, data),
  updateWork: (data: object) => service.post(`${workApiUrl}/update`, data),
  likeWork: (id: number) => service.post(`${workApiUrl}/like/${id}`),
  sendWorkComment: (data: object) => service.post(`${workApiUrl}/comment/send`, data),
  sendWorkReply: (data: object) => service.post(`${workApiUrl}/comment/reply`, data),
  creatorWorkList: (params: WorkParams) => service.get(`${workApiUrl}/creator/list`, { ...params }),
  getWorkCommentList: (params: object) => service.get(`${workApiUrl}/comment/list`, { ...params }),
  getReplyList: (params: object) => service.get(`${workApiUrl}/comment/reply/list`, { ...params }),
  getDetailByCreator: (id: number) => service.get(`${workApiUrl}/creator/detail/${id}`),
  changeWorkStatus: (data: object) => service.post(`${workApiUrl}/change/status`, data),
  deleteWork: (id: number) => service.post(`${workApiUrl}/delete/${id}`),
};

export default workApi;
