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
  forEventType: string;
  id: string;
  name: string;
  state: GameState;
  type: GameType;
}

export const LAN_PARTY_GAMES: Omit<Game, 'id'>[] = [
  {
    forEventType: 'LAN Party',
    name: 'Alien vs Predator 2',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    forEventType: 'LAN Party',
    name: 'Among us',
    state: GameState.AVAILABLE,
    type: GameType.SURVIVAL,
  },
  {
    forEventType: 'LAN Party',
    name: 'Battle for the Middle Earth 2',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    forEventType: 'LAN Party',
    name: 'CS 1.6',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    forEventType: 'LAN Party',
    name: 'Diablo II',
    state: GameState.AVAILABLE,
    type: GameType.HACK_AND_SLASH,
  },
  {
    forEventType: 'LAN Party',
    name: 'ET: Legacy',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    forEventType: 'LAN Party',
    name: 'Mount & Blade',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    forEventType: 'LAN Party',
    name: 'Re-Volt',
    state: GameState.AVAILABLE,
    type: GameType.RACING,
  },
  {
    forEventType: 'LAN Party',
    name: 'Settlers 3',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    forEventType: 'LAN Party',
    name: 'Soldat',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    forEventType: 'LAN Party',
    name: 'Stronghold: Crusader',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    forEventType: 'LAN Party',
    name: 'Unreal Tournament 2k4',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
];
