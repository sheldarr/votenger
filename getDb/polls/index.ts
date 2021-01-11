import * as yup from 'yup';

export type Decision = 'KEEP' | 'REMOVE';

export interface GameDecision {
  decision: Decision;
  name: string;
}

export interface SummaryEntry {
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
  id: string;
  username: string;
  votedFor: string[];
}

export interface Poll {
  appliedAt?: string;
  alreadyPlayed: string[];
  createdAt: string;
  description: string;
  id: string;
  name: string;
  plannedFor: string;
  summary?: Summary;
  votes: Vote[];
}
