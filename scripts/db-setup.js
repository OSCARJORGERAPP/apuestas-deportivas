import { connectToDatabase } from '../src/lib/db.js';

async function setupDatabase() {
  const { db } = await connectToDatabase();

  try {
    // Índices en apuestas
    await db.collection('apuestas').createIndex({ indice: 1 });
    await db.collection('apuestas').createIndex({ estado: 1 });
    console.log('✓ Índices en apuestas creados');

    // Índices en participantes
    await db.collection('participantes').createIndex({ mail: 1 }, { unique: true });
    await db.collection('participantes').createIndex({ indice: 1 });
    console.log('✓ Índices en participantes creados');

    // Índices en valores_apostados
    await db.collection('valores_apostados').createIndex({ id_participante: 1, id_apuesta: 1 });
    await db.collection('valores_apostados').createIndex({ id_participante: 1 });
    await db.collection('valores_apostados').createIndex({ id_apuesta: 1 });
    console.log('✓ Índices en valores_apostados creados');

    // Índices en ganadores
    await db.collection('ganadores').createIndex({ id_apuesta: 1 });
    await db.collection('ganadores').createIndex({ id_participante: 1 });
    console.log('✓ Índices en ganadores creados');

    console.log('\n✅ Database setup completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en database setup:', error);
    process.exit(1);
  }
}

setupDatabase();
