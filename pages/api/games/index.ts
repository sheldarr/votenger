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

export interface Game {
  name: string;
  type: string;
}

const GAMES: Game[] = [
  {
    name: 'Alien vs Predator 2',
    type: GameType.FPS,
  },
  {
    name: 'Among us',
    type: GameType.SURVIVAL,
  },
  {
    name: 'Battle for the Middle Earth 2',
    type: GameType.RTS,
  },
  {
    name: 'CS 1.6',
    type: GameType.FPS,
  },
  {
    name: 'Diablo II',
    type: GameType.HACK_AND_SLASH,
  },
  {
    name: 'ET: Legacy',
    type: GameType.FPS,
  },
  {
    name: 'Mount & Blade',
    type: GameType.ACTION,
  },
  {
    name: 'Re-Volt',
    type: GameType.RACING,
  },
  {
    name: 'Settlers 3',
    type: GameType.RTS,
  },
  {
    name: 'Soldat',
    type: GameType.ACTION,
  },
  {
    name: 'Stronghold: Crusader',
    type: GameType.RTS,
  },
  {
    name: 'Unreal Tournament 2k4',
    type: GameType.FPS,
  },
];

export default (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  res.status(StatusCodes.OK).json(GAMES);
};
