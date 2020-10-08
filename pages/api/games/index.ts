import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

export interface Game {
  name: string;
  type: string;
}

const GAMES: Game[] = [
  {
    name: 'Alien vs Predator 2',
    type: 'FPS',
  },
  {
    name: 'Among us',
    type: 'Detective Survival',
  },
  {
    name: 'Battle for the Middle Earth 2',
    type: 'RTS',
  },
  {
    name: 'CS 1.6',
    type: 'FPS',
  },
  {
    name: 'Diablo II',
    type: "H'n'S",
  },
  {
    name: "Don't Starve Together",
    type: 'Survival',
  },
  {
    name: 'ET: Legacy',
    type: 'FPS',
  },
  {
    name: 'Mount & Blade',
    type: 'Action',
  },
  {
    name: 'Re-Volt',
    type: 'Racing',
  },
  {
    name: 'Settlers 3',
    type: 'RTS',
  },
  {
    name: 'Soldat',
    type: '2D Shooter',
  },
  {
    name: 'Unreal Tournament 2k4',
    type: 'FPS',
  },
];

export default (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  res.status(StatusCodes.OK).json(GAMES);
};
