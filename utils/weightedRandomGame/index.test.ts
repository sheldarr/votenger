import 'jest';

import weightedRandomGame from '.';

describe('weightedRandomGame', () => {
  test('returns 1st game as winner if all games have the same number of votes and random returns 0', () => {
    // given
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };

    Math.random = () => 0;

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.25,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.25,
          firstIndex: 1,
          lastIndex: 1,
        },
        '3Game': {
          chances: 0.25,
          firstIndex: 2,
          lastIndex: 2,
        },
        '4Game': {
          chances: 0.25,
          firstIndex: 3,
          lastIndex: 3,
        },
      },
      winner: { index: 0, name: '1Game' },
    });
  });

  test('returns 4rd game as winner if all games have the same number of votes and random returns 0.999999', () => {
    // given
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };

    Math.random = () => 0.999999;

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.25,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.25,
          firstIndex: 1,
          lastIndex: 1,
        },
        '3Game': {
          chances: 0.25,
          firstIndex: 2,
          lastIndex: 2,
        },
        '4Game': {
          chances: 0.25,
          firstIndex: 3,
          lastIndex: 3,
        },
      },
      winner: { index: 3, name: '4Game' },
    });
  });

  test('returns 3rd game as winner if all games have the same number of votes and random returns the lowest number for 3rd game', () => {
    // given
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };

    Math.random = () => 0.5;

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.25,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.25,
          firstIndex: 1,
          lastIndex: 1,
        },
        '3Game': {
          chances: 0.25,
          firstIndex: 2,
          lastIndex: 2,
        },
        '4Game': {
          chances: 0.25,
          firstIndex: 3,
          lastIndex: 3,
        },
      },
      winner: { index: 2, name: '3Game' },
    });
  });

  test('returns 3rd game as winner if all games have the same number of votes and random returns the highest number for 3rd game', () => {
    // given
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };

    Math.random = () => 0.74;

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.25,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.25,
          firstIndex: 1,
          lastIndex: 1,
        },
        '3Game': {
          chances: 0.25,
          firstIndex: 2,
          lastIndex: 2,
        },
        '4Game': {
          chances: 0.25,
          firstIndex: 3,
          lastIndex: 3,
        },
      },
      winner: { index: 2, name: '3Game' },
    });
  });

  test('returns game as winner if it is the only game with the votes', () => {
    // given
    const games = {
      '1Game': [],
      '2Game': [],
      '3Game': ['paczek'],
      '4Game': [],
    };

    Math.random = () => 0;

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0,
          firstIndex: -1,
          lastIndex: -1,
        },
        '2Game': {
          chances: 0,
          firstIndex: -1,
          lastIndex: -1,
        },
        '3Game': {
          chances: 1,
          firstIndex: 0,
          lastIndex: 0,
        },
        '4Game': {
          chances: 0,
          firstIndex: -1,
          lastIndex: -1,
        },
      },
      winner: { index: 0, name: '3Game' },
    });
  });

  test('returns 2nd game as winner if it has the most votes and if random returns the lowest number for it', () => {
    // given
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

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.1,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.7,
          firstIndex: 1,
          lastIndex: 7,
        },
        '3Game': {
          chances: 0.1,
          firstIndex: 8,
          lastIndex: 8,
        },
        '4Game': {
          chances: 0.1,
          firstIndex: 9,
          lastIndex: 9,
        },
      },
      winner: { index: 1, name: '2Game' },
    });
  });

  test('returns 2nd game as winner if it has the most votes and if random returns the highest number for it', () => {
    // given
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

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.1,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.7,
          firstIndex: 1,
          lastIndex: 7,
        },
        '3Game': {
          chances: 0.1,
          firstIndex: 8,
          lastIndex: 8,
        },
        '4Game': {
          chances: 0.1,
          firstIndex: 9,
          lastIndex: 9,
        },
      },
      winner: { index: 7, name: '2Game' },
    });
  });

  test('returns 3rd game as winner if random returns number for it even if game does not have the most votes', () => {
    // given
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

    // when
    const result = weightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.1,
          firstIndex: 0,
          lastIndex: 0,
        },
        '2Game': {
          chances: 0.7,
          firstIndex: 1,
          lastIndex: 7,
        },
        '3Game': {
          chances: 0.1,
          firstIndex: 8,
          lastIndex: 8,
        },
        '4Game': {
          chances: 0.1,
          firstIndex: 9,
          lastIndex: 9,
        },
      },
      winner: { index: 8, name: '3Game' },
    });
  });
});
