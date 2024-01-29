import service from '@/api/http';
import { Images, Author, LinkBoxDto, reportFormDto } from '@/api/modules/default';

const reportApiUrl = '/web/report';

export interface commentReportFormDto extends reportFormDto {
  commentId: number;
}

const reportApi = {
  // 评论举报操作
  sendReport: (data: object) => service.post(`${reportApiUrl}/create`, data),
};

export default reportApi;
