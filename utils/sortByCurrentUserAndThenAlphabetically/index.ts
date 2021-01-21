const sortByCurrentUserAndThenAlphabetically = (username: string) => (
  a: string,
  b: string,
) => {
  if (a === username) {
    return -1;
  }

  return a.localeCompare(b);
};

export default sortByCurrentUserAndThenAlphabetically;
