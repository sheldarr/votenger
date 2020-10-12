import 'jest';
import { weightedRandomGame } from './weightedRandomGame';

describe('weightedRandomGame', () => {
  test('returns 1st game if all games have the same number of votes and random returns 0', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0;

    const result = weightedRandomGame(games);

    expect(result).toEqual('1Game');
  });

  test('returns 4rd game if all games have the same number of votes and random returns 0.999999', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.999999;

    const result = weightedRandomGame(games);

    expect(result).toEqual('4Game');
  });

  test('returns 3rd game if all games have the same number of votes and random returns the lowest number for 3rd game', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.5;

    const result = weightedRandomGame(games);

    expect(result).toEqual('3Game');
  });

  test('returns 3rd game if all games have the same number of votes and random returns the highest number for 3rd game', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.74;

    const result = weightedRandomGame(games);

    expect(result).toEqual('3Game');
  });

  test('returns game if it is the only game with the votes', () => {
    const games = {
      '1Game': [],
      '2Game': [],
      '3Game': ['paczek'],
      '4Game': [],
    };
    Math.random = () => 0;

    const result = weightedRandomGame(games);

    expect(result).toEqual('3Game');
  });

  test('returns 2nd game if it has the most votes and if random returns the lowest number for it', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': [
        'kaczek',
        'aaczek',
        'caczek',
        'daczek',
        'faczek',
        'saczek',
        'taczek',
      ],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.1;

    const result = weightedRandomGame(games);

    expect(result).toEqual('2Game');
  });

  test('returns 2nd game if it has the most votes and if random returns the highest number for it', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': [
        'kaczek',
        'aaczek',
        'caczek',
        'daczek',
        'faczek',
        'saczek',
        'taczek',
      ],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.79;

    const result = weightedRandomGame(games);

    expect(result).toEqual('2Game');
  });

  test('returns 3rd game if random returns number for it even if game does not have the most votes', () => {
    const games = {
      '1Game': ['paczek'],
      '2Game': [
        'kaczek',
        'aaczek',
        'caczek',
        'daczek',
        'faczek',
        'saczek',
        'taczek',
      ],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };
    Math.random = () => 0.8;

    const result = weightedRandomGame(games);

    expect(result).toEqual('3Game');
  });
});
