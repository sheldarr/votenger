import { useLocalStorage } from 'react-use';

export const USERNAME_LOCAL_STORAGE_KEY = 'USERNAME';

interface User {
  username: string;
}

const useUser = () => {
  return useLocalStorage<User | undefined>(USERNAME_LOCAL_STORAGE_KEY);
};

export default useUser;
