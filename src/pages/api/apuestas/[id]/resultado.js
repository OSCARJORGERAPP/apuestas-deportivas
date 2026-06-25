import { connectToDatabase } from '../../../../lib/db';
import { requireAdmin } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return requireAdmin(setResultado)(req, res);
}

async function setResultado(req, res) {
  const { id } = req.query;
  const { resultado } = req.body; // 'equipo1', 'equipo2', 'empate'

  if (!['equipo1', 'equipo2', 'empate'].includes(resultado)) {
    return res.status(400).json({ error: 'Resultado inválido' });
  }

  const { db } = await connectToDatabase();

  try {
    const apuestaId = new ObjectId(id);

    // Obtener apuesta
    const apuesta = await db.collection('apuestas').findOne({ _id: apuestaId });

    if (!apuesta) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    if (apuesta.resultado) {
      return res.status(400).json({ error: 'Resultado ya establecido para esta apuesta' });
    }

    // Obtener todos los valores apostados
    const valoresApostados = await db
      .collection('valores_apostados')
      .find({ id_apuesta: apuestaId })
      .toArray();

    // Calcular ganadores y distribución
    const ganadores = [];
    let totalRecaudacion = 0;
    const ganadoresArray = [];

    for (const valor of valoresApostados) {
      totalRecaudacion += valor.valor_apostado;

      if (valor.prediccion === resultado) {
        ganadoresArray.push(valor);
      }
    }

    // Si hay ganadores, distribución proporcional a lo apostado
    if (ganadoresArray.length > 0) {
      const totalApostadoPorGanadores = ganadoresArray.reduce((sum, v) => sum + v.valor_apostado, 0);

      for (const valor of ganadoresArray) {
        const proporcion = valor.valor_apostado / totalApostadoPorGanadores;
        const valorGanado = totalRecaudacion * proporcion;

        const ganador = {
          id_apuesta: apuestaId,
          id_participante: valor.id_participante,
          valor_ganado: valorGanado,
        };

        await db.collection('ganadores').insertOne(ganador);
        ganadores.push(ganador);
      }
    }

    // Actualizar apuesta
    await db.collection('apuestas').updateOne(
      { _id: apuestaId },
      {
        $set: {
          resultado,
          recaudacion_total: totalRecaudacion,
          estado: 'cerrada',
        },
      }
    );

    return res.status(200).json({
      message: 'Resultado establecido',
      apuesta_id: id,
      resultado,
      recaudacion_total: totalRecaudacion,
      cantidad_ganadores: ganadoresArray.length,
      ganadores,
    });
  } catch (error) {
    console.error('Error setting resultado:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
