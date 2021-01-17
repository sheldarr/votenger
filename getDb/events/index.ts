import * as yup from 'yup';

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

export type Decision = 'KEEP' | 'REMOVE';

export interface GameDecision {
  decision: Decision;
  name: string;
}

export interface SummaryEntry {
  createdAt: string;
  gamesDecisions: GameDecision[];
  proposedGames: string[];
  username: string;
}

const GameDecisionSchema = yup.object().shape({
  decision: yup.string().oneOf(['KEEP', 'REMOVE']),
  name: yup.string().required(),
});

const SummaryEntrySchema = yup.object().shape({
  gamesDecisions: yup.array().of(GameDecisionSchema).required(),
  proposedGames: yup.array().of(yup.string().required()).required(),
  username: yup.string().required(),
});

export function isSummaryEntry(entry: SummaryEntry): entry is SummaryEntry {
  return SummaryEntrySchema.isValidSync(entry);
}

export interface Summary {
  createdAt: string;
  entries: SummaryEntry[];
}

export interface Vote {
  createdAt: string;
  id: string;
  username: string;
  votedFor: string[];
}

export interface Event {
  appliedAt?: string;
  alreadyPlayedGames: string[];
  createdAt: string;
  id: string;
  name: string;
  scheduledFor?: string;
  summary?: Summary;
  type?: EventType;
  votes: Vote[];
}
