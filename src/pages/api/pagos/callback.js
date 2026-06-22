// TODO: Implementar callback de REDSYS
// En producción, verificar la firma y confirmar la apuesta

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Validar firma de REDSYS
  const { Ds_MerchantParameters, Ds_Signature } = req.body;

  // Placeholder: asumir que el pago fue exitoso
  return res.status(200).json({
    message: 'Pago procesado (placeholder)',
  });
}
