import axios from 'axios';
import useSWR from 'swr';
import { WebSocketEvents } from '../../events';
import { Poll } from '../../getDb/polls';
import useSocket from '../useSocket';

const fetcher = (url: string) =>
  axios.get<Poll[]>(url).then(({ data }) => data);

const usePolls = () => {
  const response = useSWR('/api/polls', fetcher);

  useSocket(WebSocketEvents.REFRESH_POLLS, () => {
    response.mutate();
  });

  return response;
};

export default usePolls;
