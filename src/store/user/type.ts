import { Level } from '@/api/modules/default';

export interface UserInfoState {
  nickname?: string;
  avatar?: string;
  account?: string;
  uuid?: string;
  desc?: string;
  accountId?: number;
  email?: string;
  short?: string;
  userId?: number;
  exp?: number;
  fire?: number;
  level?: Level;
  count?: {
    follow: number;
    fan: number;
    like: number;
    stick: number;
    post: number;
    work: number;
  };
  todaySign: boolean;
  isR18: boolean;
  isGrotesque: boolean;
  // [key: string]: unknown;
}
