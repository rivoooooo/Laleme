
export type BristolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Language = 'zh' | 'en';

export interface PoopRecord {
  id: string;
  timestamp: number;
  bristolType: BristolType;
  photo?: string; // base64
  note?: string;
  duration?: number; // in minutes
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  nickname: string;
  avatar?: string;
  birthday?: string;
  friendCode: string;
  friends: string[]; // list of friend codes
  language: Language;
}

export interface AppSettings {
  primaryColor: string;
  themeMode: ThemeMode;
  isGlobalShared: boolean;
}

export interface HealthSummary {
  status: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
  lastPoopTime: number | null;
  countThisWeek: number;
}

export interface RankItem {
  id: string;
  nickname: string;
  avatar: string;
  count: number;
  isMe?: boolean;
  friendCode?: string;
}

export type RankPeriod = 'week' | 'month' | 'quarter' | 'year';
export type RankScope = 'friends' | 'global';
