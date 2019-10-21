import { NextApiRequest, NextApiResponse } from 'next';

import { getVotes } from './repository';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const votes = await getVotes();

  res.status(200).send(votes);
};
