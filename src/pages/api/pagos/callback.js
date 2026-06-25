import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id_apuesta, id_participante, prediccion, orden_id } = req.body;

    if (!id_apuesta || !id_participante || !prediccion) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const { db } = await connectToDatabase();

    // Obtener apuesta
    const apuesta = await db.collection('apuestas').findOne({ _id: new ObjectId(id_apuesta) });
    if (!apuesta) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    // Validar que no haya apostado ya en esta apuesta
    const existente = await db.collection('valores_apostados').findOne({
      id_participante: new ObjectId(id_participante),
      id_apuesta: new ObjectId(id_apuesta),
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya apostaste en esta apuesta' });
    }

    // Crear apuesta (pago confirmado en REDSYS)
    const valor_apostado = apuesta.valor;

    const result = await db.collection('valores_apostados').insertOne({
      id_participante: new ObjectId(id_participante),
      id_apuesta: new ObjectId(id_apuesta),
      valor_apostado,
      prediccion,
      orden_id,
      fecha: new Date(),
    });

    // Actualizar recaudación
    await db.collection('apuestas').updateOne(
      { _id: new ObjectId(id_apuesta) },
      { $inc: { recaudacion_total: valor_apostado } }
    );

    return res.status(200).json({
      message: 'Apuesta registrada',
      apuesta_id: result.insertedId,
    });
  } catch (error) {
    console.error('Error en callback de pago:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}
