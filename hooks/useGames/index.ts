import axios from 'axios';
import useSWR from 'swr';

import { Game } from '../../pages/api/games';

const fetcher = (url: string) =>
  axios.get<Game[]>(url).then(({ data }) => data);

const useGames = () => useSWR('/api/games', fetcher);

export default useGames;
