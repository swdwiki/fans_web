import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCn from 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale(zhCn);

export default dayjs;
