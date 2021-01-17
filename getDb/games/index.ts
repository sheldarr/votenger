export enum GameType {
  ACTION = 'Action',
  FPS = 'FPS',
  HACK_AND_SLASH = 'Hack and slash',
  OTHER = 'Other',
  RACING = 'Racing',
  RTS = 'RTS',
  SURVIVAL = 'Survival',
  UNKNOWN = 'Unknown',
}

export enum GameState {
  AVAILABLE = 'AVAILABLE',
  REMOVED = 'REMOVED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface Game {
  id: string;
  name: string;
  state: GameState;
  type: GameType;
}

export const LAN_PARTY_GAMES: Omit<Game, 'id'>[] = [
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
