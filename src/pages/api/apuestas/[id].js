import { connectToDatabase } from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const objectId = new ObjectId(id);

  if (req.method === 'GET') {
    try {
      const apuesta = await db.collection('apuestas').findOne({ _id: objectId });

      if (!apuesta) {
        return res.status(404).json({ error: 'Apuesta no encontrada' });
      }

      return res.status(200).json(apuesta);
    } catch (error) {
      console.error('Error fetching apuesta:', error);
      return res.status(500).json({ error: 'Error interno' });
    }
  }

  if (req.method === 'PUT') {
    return requireAdmin(updateApuesta)(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAdmin(deleteApuesta)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function updateApuesta(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();
  const { equipo1, equipo2, valor, estado } = req.body;

  const updateData = {};
  if (equipo1) updateData.equipo1 = equipo1;
  if (equipo2) updateData.equipo2 = equipo2;
  if (valor) updateData.valor = valor;
  if (estado) updateData.estado = estado;

  try {
    const result = await db.collection('apuestas').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    return res.status(200).json(result.value);
  } catch (error) {
    console.error('Error updating apuesta:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function deleteApuesta(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('apuestas').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    return res.status(200).json({ message: 'Apuesta eliminada' });
  } catch (error) {
    console.error('Error deleting apuesta:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
