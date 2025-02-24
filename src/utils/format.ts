import dayjs from './dayjs';

export declare interface instanceObject {
  [key: string]: string;
}

/**
 * JSON转url参数
 * @param data Json格式数据
 * */
export const formatJsonToUrlParams = (data: instanceObject) => {
  return typeof data === 'object'
    ? Object.keys(data)
        .map((key) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
        })
        .join('&')
    : '';
};

export const repalceHtmlToText = (content: string) => {
  let str = content;
  str = str.replace(/<\/?.+?>/g, '');
  str = str.replace(/&nbsp;/g, ' ');
  return str;
};

/**
 * 通过dayjs获取距离现在的时间间隔
 * @param {String} time 任意格式的时间字符串
 */
export const formatTimeFromNow = (time: string) => {
  return dayjs(new Date(time)).fromNow();
};

/**
 * Base64字符串转File文件
 * @param {String} base64 Base64字符串(字符串不包含Data URI scheme)
 * @param {String} filename 文件名称
 * @param {String} type 文件类型(例如：image/png)
 */
export const base64toFile = (data: string, fileName: string, type: string) => {
  const dataArr = data.split(',');
  const byteString = atob(dataArr[1]);
  const options: any = {
    type,
    endings: 'native',
  };
  const u8Arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i += 1) {
    u8Arr[i] = byteString.charCodeAt(i);
  }
  return new File([u8Arr], `${fileName}`, options); // 返回文件流
};

/**
 * 获取农历时间
 * @param {String} date 日期
 * */
export const calendar = (date: string) => {
  const monthDict: any = {
    '1': '正',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '七',
    '8': '八',
    '9': '九',
    '10': '十',
    '11': '十一',
    '12': '腊',
  };
  const dayDict: any = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '七',
    '8': '八',
    '9': '九',
    '10': '十',
    '0': '十',
  };

  const dateTimeStr = new Date(date).toLocaleString('ja-JP-u-ca-chinese').split(' ')[0].split('-');
  let day = '';
  if (Number(dateTimeStr[2]) <= 10) {
    day = `初${dayDict[dateTimeStr[2]]}`;
  } else if (Number(dateTimeStr[2]) > 10 && Number(dateTimeStr[2]) <= 20) {
    if (Number(dateTimeStr[2][0]) === 1) {
      day = `十${dayDict[dateTimeStr[2][1]]}`;
    } else {
      day = `${dayDict[dateTimeStr[2][0]]}${dayDict[dateTimeStr[2][1]]}`;
    }
  } else if (Number(dateTimeStr[2]) > 20 && Number(dateTimeStr[2]) <= 29) {
    day = `廿${dayDict[dateTimeStr[2][1]]}`;
  } else {
    day = `${dayDict[dateTimeStr[2][0]]}${dayDict[dateTimeStr[2][1]]}`;
  }

  return `${monthDict[dateTimeStr[1]]}月${day}`;
};

export const getAssetsFile = (file: string, path: string) => {
  return new URL(`../assets/${path}/${file}`, import.meta.url).href;
};
