import { connectToDatabase } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return requireAuth(getGanador)(req, res);
}

async function getGanador(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const ganador = await db.collection('ganadores').findOne({ _id: new ObjectId(id) });

    if (!ganador) {
      return res.status(404).json({ error: 'Ganador no encontrado' });
    }

    return res.status(200).json(ganador);
  } catch (error) {
    console.error('Error fetching ganador:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
