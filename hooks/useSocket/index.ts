import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

const useSocket = <T = string>(
  eventName: string,
  callback: (data: T) => void,
) => {
  useEffect(() => {
    socket.on(eventName, callback);

    return function useSocketCleanup() {
      socket.off(eventName, callback);
    };
  }, [eventName, callback]);

  return socket;
};

export default useSocket;
