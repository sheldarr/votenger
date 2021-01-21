import 'jest';

import sortByCurrentUserAndThenAlphabetically from '.';

describe('sortByCurrentUserAndThenAlphabetically', () => {
  test('should return current user as first and then rest of them sort alphabetically', () => {
    // given
    const currentUser = 'currentUser';

    const users = ['cUser', 'aUser', 'bUser', currentUser];

    // when
    const result = users.sort(
      sortByCurrentUserAndThenAlphabetically(currentUser),
    );

    // then
    expect(result).toEqual(['currentUser', 'aUser', 'bUser', 'cUser']);
  });
});
