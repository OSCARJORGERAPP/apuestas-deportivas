import dotenv from 'dotenv';
import { connectToDatabase } from '../src/lib/db.js';

dotenv.config();

async function createAdmin() {
  const { db } = await connectToDatabase();

  try {
    const email = 'admin@example.com';

    // Verificar si ya existe
    let admin = await db.collection('participantes').findOne({ mail: email });

    if (admin) {
      console.log('✓ Admin ya existe');
      process.exit(0);
    }

    // Crear admin
    const result = await db.collection('participantes').insertOne({
      indice: 999,
      nombre: 'Admin',
      mail: email,
      role: 'admin',
    });

    console.log('✅ Admin creado exitosamente');
    console.log(`Email: ${email}`);
    console.log('Usa este email para loguearte en /login');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando admin:', error);
    process.exit(1);
  }
}

createAdmin();
