import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

export enum GameType {
  ACTION = 'Action',
  FPS = 'FPS',
  HACK_AND_SLASH = 'Hack and slash',
  OTHER = 'Other',
  RACING = 'Racing',
  RTS = 'RTS',
  SURVIVAL = 'Survival',
}

export enum GameState {
  AVAILABLE = 'Available',
  EXCLUDED = 'Excluded',
}

export interface Game {
  name: string;
  state: GameState;
  type: GameType;
}

const GAMES: Game[] = [
  {
    name: 'Alien vs Predator 2',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    name: 'Among us',
    state: GameState.AVAILABLE,
    type: GameType.SURVIVAL,
  },
  {
    name: 'Battle for the Middle Earth 2',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    name: 'CS 1.6',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    name: 'Diablo II',
    state: GameState.AVAILABLE,
    type: GameType.HACK_AND_SLASH,
  },
  {
    name: 'ET: Legacy',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    name: 'Mount & Blade',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    name: 'Re-Volt',
    state: GameState.AVAILABLE,
    type: GameType.RACING,
  },
  {
    name: 'Settlers 3',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    name: 'Soldat',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    name: 'Stronghold: Crusader',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    name: 'Unreal Tournament 2k4',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
];

export default (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  res.status(StatusCodes.OK).json(GAMES);
};
