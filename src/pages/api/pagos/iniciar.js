import { requireAuth } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return requireAuth(iniciarPago)(req, res);
}

async function iniciarPago(req, res) {
  const { id_apuesta, id_participante, prediccion } = req.body;

  if (!id_apuesta || !id_participante || !prediccion) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const { db } = await connectToDatabase();

    // Obtener apuesta para saber el monto
    const apuesta = await db.collection('apuestas').findOne({ _id: new ObjectId(id_apuesta) });
    if (!apuesta) {
      return res.status(404).json({ error: 'Apuesta no encontrada' });
    }

    // Generar orden única
    const timestamp = Date.now().toString().slice(-6);
    const orden_id = `${apuesta.indice}${timestamp}`;

    // En modo prueba, retornar parámetros REDSYS sin cifrado real
    const redsysParams = {
      DS_MERCHANT_MerchantCode: process.env.REDSYS_MERCHANT_CODE || '999008881',
      DS_MERCHANT_Terminal: process.env.REDSYS_TERMINAL_ID || '1',
      DS_MERCHANT_Order: orden_id,
      DS_MERCHANT_Amount: Math.round(apuesta.valor * 100),
      DS_MERCHANT_Currency: '978',
      DS_MERCHANT_TransactionType: '0',
      DS_MERCHANT_ProductDescription: `${apuesta.equipo1} vs ${apuesta.equipo2}`,
      DS_MERCHANT_ConsumerLanguage: '001',
      DS_MERCHANT_UrlOk: `${process.env.APP_URL}/pagos/exito`,
      DS_MERCHANT_UrlKo: `${process.env.APP_URL}/pagos/error`,
    };

    return res.status(200).json({
      message: 'Pago iniciado',
      orden_id,
      monto: apuesta.valor,
      redsysParams,
      // Datos necesarios para callback
      id_apuesta,
      id_participante,
      prediccion,
    });
  } catch (error) {
    console.error('Error iniciar pago:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
