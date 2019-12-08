export const USERNAME_LOCAL_STORAGE_KEY = 'USERNAME';

export const login = (username: string) => {
  localStorage.setItem(USERNAME_LOCAL_STORAGE_KEY, username);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_LOCAL_STORAGE_KEY);
};

export const logout = () => {
  localStorage.removeItem(USERNAME_LOCAL_STORAGE_KEY);
};
