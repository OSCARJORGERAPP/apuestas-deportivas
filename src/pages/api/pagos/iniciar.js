import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return requireAuth(iniciarPago)(req, res);
}

async function iniciarPago(req, res) {
  const { monto, orden_id, descripcion } = req.body;

  if (!monto || !orden_id) {
    return res.status(400).json({ error: 'Monto u orden_id faltante' });
  }

  try {
    // TODO: Generar parámetros cifrados de REDSYS
    // Por ahora, retornar un formulario simplificado para pruebas

    const redsysForm = {
      Ds_Merchant_MerchantCode: process.env.REDSYS_MERCHANT_CODE || '999008881',
      Ds_Merchant_TerminalId: process.env.REDSYS_TERMINAL_ID || '1',
      Ds_Merchant_Order: orden_id,
      Ds_Merchant_Amount: Math.round(monto * 100).toString(),
      Ds_Merchant_Currency: '978', // EUR
      Ds_Merchant_TransactionType: '0', // Compra
      Ds_Merchant_ProductDescription: descripcion || 'Apuesta deportiva',
      Ds_Merchant_ConsumerLanguage: '001', // ES
      Ds_Merchant_UrlOk: `${process.env.APP_URL}/pagos/exito`,
      Ds_Merchant_UrlKo: `${process.env.APP_URL}/pagos/error`,
    };

    return res.status(200).json({
      message: 'Formulario REDSYS listo',
      redsysForm,
      // TODO: En producción, cifrar con algoritmo REDSYS
    });
  } catch (error) {
    console.error('Error iniciar pago:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
}

export default handler;
