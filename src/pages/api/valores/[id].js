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
    return requireAuth(getValor)(req, res);
  }

  if (req.method === 'PUT') {
    return requireAuth(updateValor)(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAdmin(deleteValor)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getValor(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  try {
    const valor = await db.collection('valores_apostados').findOne({ _id: new ObjectId(id) });

    if (!valor) {
      return res.status(404).json({ error: 'Valor no encontrado' });
    }

    return res.status(200).json(valor);
  } catch (error) {
    console.error('Error fetching valor:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function updateValor(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();
  const { valor_apostado, prediccion } = req.body;

  const updateData = {};
  if (valor_apostado) updateData.valor_apostado = valor_apostado;
  if (prediccion) {
    if (!['equipo1', 'equipo2', 'empate'].includes(prediccion)) {
      return res.status(400).json({ error: 'Predicción inválida' });
    }
    updateData.prediccion = prediccion;
  }

  try {
    const result = await db.collection('valores_apostados').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Valor no encontrado' });
    }

    return res.status(200).json(result.value);
  } catch (error) {
    console.error('Error updating valor:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function deleteValor(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('valores_apostados').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Valor no encontrado' });
    }

    return res.status(200).json({ message: 'Valor eliminado' });
  } catch (error) {
    console.error('Error deleting valor:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
