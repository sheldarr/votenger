import axios from 'axios';
import useSWR from 'swr';

import { Poll } from '../../pages/api/polls';

const fetcher = (url: string) => axios.get<Poll>(url).then(({ data }) => data);

const usePoll = (id: string) => useSWR(id && `/api/polls/${id}`, fetcher);

export default usePoll;
