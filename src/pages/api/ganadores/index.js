import { connectToDatabase } from '../../../lib/db';
import { requireAuth, requireAdmin } from '../../../lib/auth';

async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    return requireAuth(getGanadores)(req, res);
  }

  if (req.method === 'DELETE' && req.query.reset === 'true') {
    return requireAdmin(resetGanadores)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getGanadores(req, res) {
  const { db } = await connectToDatabase();

  try {
    const userId = req.user?.participantId || req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const { ObjectId } = await import('mongodb');
    let matchStage = { id_participante: new ObjectId(userId) };
    if (userRole === 'admin') {
      matchStage = {};
    }

    const ganadores = await db.collection('ganadores').aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'participantes',
          localField: 'id_participante',
          foreignField: '_id',
          as: 'participante',
        },
      },
      {
        $addFields: {
          email: { $arrayElemAt: ['$participante.mail', 0] },
        },
      },
      {
        $project: {
          participante: 0,
        },
      },
    ]).toArray();

    return res.status(200).json(ganadores);
  } catch (error) {
    console.error('Error fetching ganadores:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function resetGanadores(req, res) {
  const { db } = await connectToDatabase();

  try {
    await db.collection('ganadores').deleteMany({});
    return res.status(200).json({ message: 'Ganadores reseteados' });
  } catch (error) {
    console.error('Error resetting ganadores:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
