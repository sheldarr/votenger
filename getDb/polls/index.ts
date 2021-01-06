import { Game } from '../games';

type GameProposition = Pick<Game, 'name' | 'type'>;

interface SummaryVote {
  proposedGames: GameProposition[];
  username: string;
  votedForRemoval: string[];
}

export interface Summary {
  createdAt: string;
  votes: SummaryVote[];
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
