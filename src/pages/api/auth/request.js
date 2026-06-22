import { connectToDatabase } from '../../../lib/db';
import { generateToken } from '../../../lib/auth';
import { sendMagicLink } from '../../../lib/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const { db } = await connectToDatabase();

    // Verificar si el participante existe
    let participant = await db.collection('participantes').findOne({ mail: email });

    if (!participant) {
      // Crear nuevo participante
      const lastParticipant = await db
        .collection('participantes')
        .findOne({}, { sort: { indice: -1 } });

      const newIndice = (lastParticipant?.indice || 0) + 1;

      const result = await db.collection('participantes').insertOne({
        indice: newIndice,
        nombre: email.split('@')[0], // nombre por defecto
        mail: email,
      });

      participant = { _id: result.insertedId, mail: email, nombre: email.split('@')[0] };
    }

    // Generar token
    const token = generateToken({
      participantId: participant._id.toString(),
      email: participant.mail,
      role: 'participant',
    });

    // Enviar email con magic link
    const emailSent = await sendMagicLink(email, token);

    if (!emailSent) {
      return res.status(500).json({ error: 'No se pudo enviar el email' });
    }

    return res.status(200).json({
      message: 'Magic link enviado a tu email',
      email,
    });
  } catch (error) {
    console.error('Error en auth/request:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
