// TODO: Implementar lógica de REDSYS
// Generación de parámetros, validación de firma, manejo de callback

export function generateRedsysForm(params) {
  // TODO: generar formulario REDSYS con parámetros cifrados
  return {
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters: '{}', // Cifrado base64
    Ds_Signature: '', // Firma
  };
}

export function verifyRedsysSignature(signature, merchantParams) {
  // TODO: verificar firma del callback de REDSYS
  return true;
}
