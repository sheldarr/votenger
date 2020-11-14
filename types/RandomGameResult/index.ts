export interface RandomGameResult {
  games: {
    [gameName: string]: {
      chances: number;
      firstIndex: number;
      lastIndex: number;
    };
  };
  winner: {
    index: number;
    name: string;
  };
}
