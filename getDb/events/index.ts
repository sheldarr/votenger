export enum EventTypeEnum {
  BOARD_GAME_PARTY = 'BOARD_GAME_PARTY',
  COUCH_PARTY = 'COUCH_PARTY',
  LAN_PARTY = 'LAN_PARTY',
  RPG = 'RPG',
}

export type EventType =
  | 'BOARD_GAME_PARTY'
  | 'COUCH_PARTY'
  | 'LAN_PARTY'
  | 'RPG';

export interface Event {
  id: string;
  name: string;
  scheduledFor?: string;
  type?: EventType;
}
