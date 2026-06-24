import { connectToDatabase } from '../../../lib/db';
import { requireAuth, requireAdmin } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    return requireAuth(getValores)(req, res);
  }

  if (req.method === 'POST') {
    return requireAuth(createValor)(req, res);
  }

  if (req.method === 'DELETE' && req.query.reset === 'true') {
    return requireAdmin(resetValores)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getValores(req, res) {
  const { db } = await connectToDatabase();
  const { participantId, role } = req.user;

  try {
    let query = {};
    if (role !== 'admin') {
      query = { id_participante: new ObjectId(participantId) };
    }
    const valores = await db.collection('valores_apostados').find(query).toArray();
    return res.status(200).json(valores);
  } catch (error) {
    console.error('Error fetching valores:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function createValor(req, res) {
  const { db } = await connectToDatabase();
  const { id_participante, id_apuesta, prediccion } = req.body;

  if (!id_participante || !id_apuesta || !prediccion) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  if (!['equipo1', 'equipo2', 'empate'].includes(prediccion)) {
    return res.status(400).json({ error: 'Predicción inválida' });
  }

  try {
    // Obtener apuesta y su valor fijo
    const apuesta = await db.collection('apuestas').findOne({ _id: new ObjectId(id_apuesta) });
    if (!apuesta) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    // Prevenir duplicados: verificar si el usuario ya apostó en esta apuesta
    const existente = await db.collection('valores_apostados').findOne({
      id_participante: new ObjectId(id_participante),
      id_apuesta: new ObjectId(id_apuesta),
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya apostaste en esta apuesta' });
    }

    const valor_apostado = apuesta.valor;

    const result = await db.collection('valores_apostados').insertOne({
      id_participante: new ObjectId(id_participante),
      id_apuesta: new ObjectId(id_apuesta),
      valor_apostado,
      prediccion,
    });

    // Actualizar recaudación en apuesta
    await db.collection('apuestas').updateOne(
      { _id: new ObjectId(id_apuesta) },
      { $inc: { recaudacion_total: valor_apostado } }
    );

    return res.status(201).json({
      _id: result.insertedId,
      id_participante,
      id_apuesta,
      valor_apostado,
      prediccion,
    });
  } catch (error) {
    console.error('Error creating valor:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function resetValores(req, res) {
  const { db } = await connectToDatabase();

  try {
    await db.collection('valores_apostados').deleteMany({});
    return res.status(200).json({ message: 'Valores reseteados' });
  } catch (error) {
    console.error('Error resetting valores:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
