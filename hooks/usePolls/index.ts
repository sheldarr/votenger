import axios from 'axios';
import useSWR from 'swr';

import { Poll } from '../../pages/api/polls';

const fetcher = (url: string) =>
  axios.get<Poll[]>(url).then(({ data }) => data);

const usePolls = () => useSWR('/api/polls', fetcher);

export default usePolls;
