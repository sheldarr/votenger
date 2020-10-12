const ADMINS_SEPARATOR = ';';

export const isUserAdmin = (username: string) => {
  return process.env.NEXT_PUBLIC_ADMINS.split(ADMINS_SEPARATOR).includes(
    username,
  );
};
