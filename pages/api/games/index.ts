import { NextApiRequest, NextApiResponse } from 'next';
import StatusCodes from 'http-status-codes';

export interface Game {
  name: string;
  type: string;
}

const GAMES: Game[] = [
  {
    name: 'Age of Empires II',
    type: 'RTS',
  },
  {
    name: 'Age of Mythology',
    type: 'RTS',
  },
  {
    name: 'Alien vs Predator',
    type: 'FPS',
  },
  {
    name: 'Among us',
    type: 'Detective Survival',
  },
  {
    name: 'Batlle Realms',
    type: 'RTS',
  },
  {
    name: 'Cossacs',
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
    name: 'Duke Nukem 3D',
    type: 'FPS',
  },
  {
    name: 'Dungeon Keeper 2',
    type: 'RTS',
  },
  {
    name: 'ET: Legacy',
    type: 'FPS',
  },
  {
    name: 'Empire Earth II',
    type: 'RTS',
  },
  {
    name: 'Fallout Tactics',
    type: 'Strategy',
  },
  {
    name: 'Giants Citizen Kabuto',
    type: 'FPS',
  },
  {
    name: 'Icewind Dale',
    type: 'Rpg',
  },
  {
    name: 'Knights & Merchants',
    type: 'RTS',
  },
  {
    name: 'Mount & Blade',
    type: 'Action',
  },
  {
    name: 'Quake III Arena',
    type: 'FPS',
  },
  {
    name: 'Re-Volt',
    type: 'Racing',
  },
  {
    name: 'Serious Sam',
    type: 'FPS',
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
    name: 'Twierdza',
    type: 'RTS',
  },
  {
    name: 'Tzar',
    type: 'RTS',
  },
  {
    name: 'Unreal Tournament',
    type: 'FPS',
  },
  {
    name: 'Warcraft II',
    type: 'RTS',
  },
  {
    name: 'Warcraft III',
    type: 'RTS',
  },
];

export default (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
  res.status(StatusCodes.OK).json(GAMES);
};
