import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) =>
  axios.get<string[]>(url).then(({ data }) => data);

const useEventTypes = () => useSWR('/api/eventTypes', fetcher);

export default useEventTypes;
