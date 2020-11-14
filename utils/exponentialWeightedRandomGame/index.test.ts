import 'jest';

import exponentialWeightedRandomGame from '.';

describe('exponentialWeightedRandomGame', () => {
  test('games with the same number of votes should have the same chances', () => {
    // given
    const games = {
      '1Game': ['paczek'],
      '2Game': ['kaczek'],
      '3Game': ['laczek'],
      '4Game': ['baczek'],
    };

    Math.random = () => 0;

    // when
    const result = exponentialWeightedRandomGame(games);

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

  test('game with two times more votes should have two times bigger chances', () => {
    // given
    const games = {
      '1Game': ['paczek', 'taczek'],
      '2Game': ['kaczek'],
    };

    Math.random = () => 0;

    // when
    const result = exponentialWeightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.6666666666666666,
          firstIndex: 0,
          lastIndex: 1,
        },
        '2Game': {
          chances: 0.3333333333333333,
          firstIndex: 2,
          lastIndex: 2,
        },
      },
      winner: { index: 0, name: '1Game' },
    });
  });

  test('game with three times more votes should have four times bigger chances', () => {
    // given
    const games = {
      '1Game': ['paczek', 'taczek', 'daczek'],
      '2Game': ['kaczek'],
    };

    Math.random = () => 0;

    // when
    const result = exponentialWeightedRandomGame(games);

    // then
    expect(result).toEqual({
      games: {
        '1Game': {
          chances: 0.8,
          firstIndex: 0,
          lastIndex: 3,
        },
        '2Game': {
          chances: 0.2,
          firstIndex: 4,
          lastIndex: 4,
        },
      },
      winner: { index: 0, name: '1Game' },
    });
  });
});
