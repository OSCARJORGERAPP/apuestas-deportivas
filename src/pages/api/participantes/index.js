import { connectToDatabase } from '../../../lib/db';
import { requireAuth, requireAdmin } from '../../../lib/auth';

async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    return requireAuth(async (req, res) => {
      try {
        const participantes = await db.collection('participantes').find({}).toArray();
        return res.status(200).json(participantes);
      } catch (error) {
        console.error('Error fetching participantes:', error);
        return res.status(500).json({ error: 'Error interno' });
      }
    })(req, res);
  }

  if (req.method === 'DELETE' && req.query.reset === 'true') {
    return requireAdmin(resetParticipantes)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function resetParticipantes(req, res) {
  const { db } = await connectToDatabase();

  try {
    await db.collection('participantes').deleteMany({});
    return res.status(200).json({ message: 'Participantes reseteados' });
  } catch (error) {
    console.error('Error resetting participantes:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
