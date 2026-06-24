import dotenv from 'dotenv';
import { connectToDatabase } from '../src/lib/db.js';

dotenv.config();

async function resetDatabase() {
  const { db } = await connectToDatabase();

  try {
    // Limpiar colecciones
    const collections = ['apuestas', 'participantes', 'valores_apostados', 'ganadores'];

    for (const col of collections) {
      await db.collection(col).deleteMany({});
      console.log(`✓ ${col} limpiada`);
    }

    // Re-ejecutar seed
    console.log('\n📦 Poblando datos de ejemplo...\n');

    const participantes = [
      { indice: 1, nombre: 'Juan Pérez', mail: 'juan@example.com' },
      { indice: 2, nombre: 'María García', mail: 'maria@example.com' },
      { indice: 3, nombre: 'Carlos López', mail: 'carlos@example.com' },
      { indice: 4, nombre: 'Ana Martínez', mail: 'ana@example.com' },
      { indice: 5, nombre: 'Pedro Sánchez', mail: 'pedro@example.com' },
    ];

    const participantesRes = await db.collection('participantes').insertMany(participantes);
    const participanteIds = Object.values(participantesRes.insertedIds);
    console.log(`✓ ${participantes.length} participantes creados`);

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
    const apuestasIds = Object.values(apuestasRes.insertedIds);
    console.log(`✓ ${apuestas.length} apuestas creadas`);

    const valoresApostados = [
      { id_participante: participanteIds[0], id_apuesta: apuestasIds[0], valor_apostado: 100, prediccion: 'equipo1' },
      { id_participante: participanteIds[1], id_apuesta: apuestasIds[0], valor_apostado: 50, prediccion: 'equipo2' },
      { id_participante: participanteIds[2], id_apuesta: apuestasIds[0], valor_apostado: 75, prediccion: 'equipo1' },
      { id_participante: participanteIds[1], id_apuesta: apuestasIds[1], valor_apostado: 60, prediccion: 'equipo1' },
      { id_participante: participanteIds[3], id_apuesta: apuestasIds[1], valor_apostado: 40, prediccion: 'equipo2' },
      { id_participante: participanteIds[2], id_apuesta: apuestasIds[2], valor_apostado: 150, prediccion: 'empate' },
      { id_participante: participanteIds[4], id_apuesta: apuestasIds[2], valor_apostado: 200, prediccion: 'equipo1' },
      { id_participante: participanteIds[0], id_apuesta: apuestasIds[2], valor_apostado: 100, prediccion: 'equipo2' },
    ];

    await db.collection('valores_apostados').insertMany(valoresApostados);
    console.log(`✓ ${valoresApostados.length} valores apostados creados`);

    console.log('\n✅ Reset completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en reset:', error);
    process.exit(1);
  }
}

resetDatabase();
