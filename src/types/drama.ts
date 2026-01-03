export interface Drama {
  shortPlayId: string;
  shortPlayLibraryId: string;
  shortPlayName: string;
  shortPlayLabels: string;
  labelArray: string[];
  isNewLabel: boolean;
  shortPlayCover: string;
  groupShortPlayCover: string;
  scriptName: string;
  scriptType: number;
  heatScore: number;
  heatScoreShow: string;
  totalReserveNum: string;
  isReserve: number;
  publishTime: number;
  isChase: boolean;
}

export interface Subtitle {
  url: string;
  format: string;
  sub_id: string;
  language_id: number;
  subtitleLanguage: string;
}

export interface Episode {
  shortPlayId: string;
  shortPlayLibraryId: string;
  episodeId: string;
  episodeNo: number;
  episodeType: number;
  episodeCover: string;
  likeNums: string;
  chaseNums: string;
  isLike: boolean;
  isChase: boolean;
  playVoucher: string;
  playClarity: string;
  sdkVid: string;
  isLock: boolean;
  isVip: boolean;
  isAd: boolean;
  episodeGoldCoinPrice: number;
  subtitleList?: Subtitle[];
}

export interface DramaDetail {
  shortPlayId: string;
  shortPlayLibraryId: string;
  shortPlayName: string;
  shortPlayCover: string;
  shortPlayLabels: string[];
  isNewLabel: boolean;
  shotIntroduce: string;
  payPoint: number;
  totalEpisode: number;
  goldCoinPrice: number;
  isFinish: number;
  isChase: boolean;
  defaultLikeNums: number;
  defaultChaseNums: number;
  onlineState: number;
  shortPlayEpisodeInfos: Episode[];
}

export interface ContentGroup {
  contentType: number;
  groupId: string;
  contentName: string;
  contentModel: number;
  contentInfos: Drama[];
}

export type ApiResponse = ContentGroup[];

export type TabType = 'home' | 'hot' | 'foryou' | 'library';

export interface SearchResult {
  shortPlayId: string;
  shortPlayLibraryId: string;
  shortPlayName: string;
  shortPlayCover: string;
  shotIntroduce: string | null;
  labelNames: string;
  labelNameList: string[];
  heatScore: number;
  formatHeatScore: string;
}

export interface SearchResponse {
  searchCode: string[];
  searchCodeSearchResult: SearchResult[];
}
