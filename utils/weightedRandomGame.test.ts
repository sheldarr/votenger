import 'jest';
import { weightedRandomGame } from './weightedRandomGame';

describe('weightedRandomGame', () => {
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

  test('returns 3rd game if all games have no votes and random returns number for 3rd range', () => {
    const games = {
      '1Game': [],
      '2Game': [],
      '3Game': [],
      '4Game': [],
    };
    Math.random = () => 0.6;

    const result = weightedRandomGame(games);

    expect(result).toEqual('3Game');
  });

  test('returns 2nd game if it is the only game with the votes', () => {
    const games = {
      '1Game': [],
      '2Game': ['paczek'],
      '3Game': [],
      '4Game': [],
    };
    Math.random = () => 0;

    const result = weightedRandomGame(games);

    expect(result).toEqual('2Game');
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
});
