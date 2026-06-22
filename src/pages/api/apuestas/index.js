import { connectToDatabase } from '../../../lib/db';
import { requireAuth, requireAdmin } from '../../../lib/auth';

async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const apuestas = await db.collection('apuestas').find({}).toArray();
      return res.status(200).json(apuestas);
    } catch (error) {
      console.error('Error fetching apuestas:', error);
      return res.status(500).json({ error: 'Error interno' });
    }
  }

  if (req.method === 'POST') {
    return requireAdmin(createApuesta)(req, res);
  }

  if (req.method === 'DELETE' && req.query.reset === 'true') {
    return requireAdmin(resetApuestas)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function createApuesta(req, res) {
  const { db } = await connectToDatabase();
  const { equipo1, equipo2, valor } = req.body;

  if (!equipo1 || !equipo2 || !valor) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const lastApuesta = await db
      .collection('apuestas')
      .findOne({}, { sort: { indice: -1 } });

    const newIndice = (lastApuesta?.indice || 0) + 1;

    const result = await db.collection('apuestas').insertOne({
      indice: newIndice,
      equipo1,
      equipo2,
      valor,
      recaudacion_total: 0,
      estado: 'abierta',
      resultado: null,
    });

    return res.status(201).json({
      _id: result.insertedId,
      indice: newIndice,
      equipo1,
      equipo2,
      valor,
      recaudacion_total: 0,
      estado: 'abierta',
      resultado: null,
    });
  } catch (error) {
    console.error('Error creating apuesta:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function resetApuestas(req, res) {
  const { db } = await connectToDatabase();

  try {
    await db.collection('apuestas').deleteMany({});
    await db.collection('valores_apostados').deleteMany({});
    await db.collection('ganadores').deleteMany({});

    return res.status(200).json({ message: 'Apuestas reseteadas' });
  } catch (error) {
    console.error('Error resetting apuestas:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
