import { connectToDatabase } from '../src/lib/db.js';
import { ObjectId } from 'mongodb';

export async function seedTestData() {
  const { db } = await connectToDatabase();

  try {
    // Limpiar colecciones
    await Promise.all([
      db.collection('participantes').deleteMany({}),
      db.collection('apuestas').deleteMany({}),
      db.collection('valores_apostados').deleteMany({}),
      db.collection('ganadores').deleteMany({}),
    ]);

    // Participantes
    const participantes = [
      { indice: 1, nombre: 'Juan Pérez', mail: 'juan@example.com' },
      { indice: 2, nombre: 'María García', mail: 'maria@example.com' },
      { indice: 3, nombre: 'Carlos López', mail: 'carlos@example.com' },
    ];

    const participantesRes = await db.collection('participantes').insertMany(participantes);
    const participanteIds = Object.values(participantesRes.insertedIds).map(id => new ObjectId(id));

    // Apuestas
    const apuestas = [
      {
        indice: 1,
        equipo1: 'Real Madrid',
        equipo2: 'Barcelona',
        valor: 100,
        recaudacion_total: 0,
        estado: 'abierta',
        resultado: null,
      },
      {
        indice: 2,
        equipo1: 'Liverpool',
        equipo2: 'Manchester United',
        valor: 50,
        recaudacion_total: 0,
        estado: 'abierta',
        resultado: null,
      },
      {
        indice: 3,
        equipo1: 'Paris SG',
        equipo2: 'Bayern Munich',
        valor: 150,
        recaudacion_total: 0,
        estado: 'abierta',
        resultado: null,
      },
    ];

    const apuestasRes = await db.collection('apuestas').insertMany(apuestas);
    const apuestasIds = Object.values(apuestasRes.insertedIds).map(id => new ObjectId(id));

    // Valores apostados
    const valoresApostados = [
      { id_participante: participanteIds[0], id_apuesta: apuestasIds[0], valor_apostado: 100, prediccion: 'equipo1' },
      { id_participante: participanteIds[1], id_apuesta: apuestasIds[0], valor_apostado: 50, prediccion: 'equipo2' },
      { id_participante: participanteIds[2], id_apuesta: apuestasIds[1], valor_apostado: 60, prediccion: 'equipo1' },
    ];

    await db.collection('valores_apostados').insertMany(valoresApostados);

    return { participanteIds, apuestasIds };
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
}

export async function cleanTestData() {
  const { db } = await connectToDatabase();
  await Promise.all([
    db.collection('participantes').deleteMany({}),
    db.collection('apuestas').deleteMany({}),
    db.collection('valores_apostados').deleteMany({}),
    db.collection('ganadores').deleteMany({}),
  ]);
}

export async function getMailhogEmail(toEmail, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Usar el endpoint /api/v2/messages en lugar de search
      const response = await fetch(`http://localhost:8025/api/v2/messages?limit=100`);
      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        // Buscar el email más reciente que contiene el toEmail
        const email = data.items.find(e =>
          e.To?.some(t => t.includes(toEmail))
        );
        if (email) {
          return email;
        }
      }
    } catch (error) {
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
    }
  }
  return null;
}

export function extractTokenFromEmail(emailData) {
  if (!emailData || !emailData.Raw || !emailData.Raw.Data) {
    return null;
  }
  // JWT tokens tienen 3 partes separadas por puntos: header.payload.signature
  // Buscar el token en el formato token=...
  const tokenMatch = emailData.Raw.Data.match(/token=([a-zA-Z0-9._\-]+(?:\.[a-zA-Z0-9._\-]+)*)/);
  return tokenMatch ? tokenMatch[1] : null;
}
