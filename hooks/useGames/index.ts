import axios from 'axios';
import useSWR from 'swr';

import { Game } from '../../getDb/games';
import { WebSocketEvents } from '../../events';
import useSocket from '../useSocket';

const fetcher = (url: string) =>
  axios.get<Game[]>(url).then(({ data }) => data);

const useGames = () => {
  const response = useSWR('/api/games', fetcher);

  useSocket(WebSocketEvents.REFRESH_GAMES, () => {
    response.mutate();
  });

  return response;
};

export default useGames;
