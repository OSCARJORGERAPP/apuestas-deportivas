import { connectToDatabase } from '../../../lib/db';
import { requireAuth, requireAdmin } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  const objectId = new ObjectId(id);

  if (req.method === 'GET') {
    return requireAuth(getParticipante)(req, res);
  }

  if (req.method === 'PUT') {
    return requireAuth(updateParticipante)(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAdmin(deleteParticipante)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getParticipante(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  try {
    const participante = await db
      .collection('participantes')
      .findOne({ _id: new ObjectId(id) });

    if (!participante) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    return res.status(200).json(participante);
  } catch (error) {
    console.error('Error fetching participante:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function updateParticipante(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();
  const { nombre, mail } = req.body;

  const updateData = {};
  if (nombre) updateData.nombre = nombre;
  if (mail) updateData.mail = mail;

  try {
    const result = await db.collection('participantes').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    return res.status(200).json(result.value);
  } catch (error) {
    console.error('Error updating participante:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function deleteParticipante(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('participantes').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Participante no encontrado' });
    }

    return res.status(200).json({ message: 'Participante eliminado' });
  } catch (error) {
    console.error('Error deleting participante:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
