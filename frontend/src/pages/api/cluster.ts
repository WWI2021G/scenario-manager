import { NextApiRequest, NextApiResponse } from 'next';
import scenarioRoutes from '../../../../backend/src/routes/scenarioRoutes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await scenarioRoutes(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
