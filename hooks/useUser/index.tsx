import { useLocalStorage } from 'react-use';

export const USER_LOCAL_STORAGE_KEY = 'USER';

interface User {
  username: string;
}

const useUser = () => {
  return useLocalStorage<User | undefined>(USER_LOCAL_STORAGE_KEY);
};

export default useUser;
