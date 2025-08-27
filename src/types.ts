export interface Danmu {
  time: number;
  mode: number;
  fontSize: number;
  color: number;
  timestamp: number;
  pool: number;
  senderHash: string;
  dbID: string;
  text: string;
  displayed: boolean;
}

export interface DanmuElement extends HTMLDivElement {
  isActive?: boolean;
}