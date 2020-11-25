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
  AVAILABLE = 'AVAILABLE',
  EXCLUDED = 'EXCLUDED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface Game {
  id: string;
  name: string;
  state: GameState;
  type: GameType;
}

const GAMES: Game[] = [
  {
    id: '06e20bc0-dc47-4c21-a52d-c2a78ae92d28',
    name: 'Alien vs Predator 2',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    id: '74b82cfd-bc9b-42ad-a39c-ce5330a402a4',
    name: 'Among us',
    state: GameState.AVAILABLE,
    type: GameType.SURVIVAL,
  },
  {
    id: '5dca1924-fb0d-4f17-a210-f1cd35ecbfbd',
    name: 'Battle for the Middle Earth 2',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    id: '63b66ff0-012b-436a-a2d6-1ce0d62f0015',
    name: 'CS 1.6',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    id: 'e2984a09-342b-4ed1-b66f-bff3725ce408',
    name: 'Diablo II',
    state: GameState.AVAILABLE,
    type: GameType.HACK_AND_SLASH,
  },
  {
    id: 'daacac02-d618-45f3-bcf2-111d3f2c27bc',
    name: 'ET: Legacy',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
  {
    id: '8aad7b92-02eb-4559-8af2-83e726b1bfec',
    name: 'Mount & Blade',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    id: 'ef6b2f73-e543-403f-ba1c-c7de0e433892',
    name: 'Re-Volt',
    state: GameState.AVAILABLE,
    type: GameType.RACING,
  },
  {
    id: 'e5f7c579-800d-404e-924c-b93d4da4a7e9',
    name: 'Settlers 3',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    id: '9179e4ae-befd-414c-a774-7e3c4320c039',
    name: 'Soldat',
    state: GameState.AVAILABLE,
    type: GameType.ACTION,
  },
  {
    id: 'a8331814-7646-46b9-a491-05c183a77200',
    name: 'Stronghold: Crusader',
    state: GameState.AVAILABLE,
    type: GameType.RTS,
  },
  {
    id: '9664b6e7-fffe-447c-a10c-7dfa2abfa7f9',
    name: 'Unreal Tournament 2k4',
    state: GameState.AVAILABLE,
    type: GameType.FPS,
  },
];

export default GAMES;
