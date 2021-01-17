import axios from 'axios';
import useSWR from 'swr';
import { WebSocketEvents } from '../../events';
import { Event } from '../../getDb/events';
import useSocket from '../useSocket';

const fetcher = (url: string) =>
  axios.get<Event[]>(url).then(({ data }) => data);

const useEvents = () => {
  const response = useSWR('/api/events', fetcher);

  useSocket(WebSocketEvents.REFRESH_EVENTS, () => {
    response.mutate();
  });

  return response;
};

export default useEvents;
