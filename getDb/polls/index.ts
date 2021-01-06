import * as yup from 'yup';

import { Game } from '../games';

type GameProposition = Pick<Game, 'name' | 'type'>;

export interface SummaryEntry {
  proposedGames: GameProposition[];
  selectedForRemoval: string[];
  username: string;
}

const GamePropositionSchema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
});

const SummaryEntrySchema = yup.object().shape({
  proposedGames: yup.array().of(GamePropositionSchema).required(),
  selectedForRemoval: yup.array().of(yup.string().required()),
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
  alreadyPlayed: string[];
  createdAt: string;
  description: string;
  id: string;
  name: string;
  plannedFor: string;
  summary?: Summary;
  votes: Vote[];
}
