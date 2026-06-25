import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';

export default function PagoREDSYS() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del pago desde sessionStorage
    const data = sessionStorage.getItem('paymentData');
    if (data) {
      setPaymentData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Cargando...</div>
      </Layout>
    );
  }

  if (!paymentData) {
    return (
      <Layout>
        <Card>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p>No se encontraron datos de pago</p>
          </div>
        </Card>
      </Layout>
    );
  }

  const handleConfirmPayment = async () => {
    try {
      // En modo prueba, llamar directamente al callback
      const res = await fetch('/api/pagos/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_apuesta: paymentData.id_apuesta,
          id_participante: paymentData.id_participante,
          prediccion: paymentData.prediccion,
          orden_id: paymentData.orden_id,
        }),
      });

      if (!res.ok) {
        throw new Error('Error procesando pago');
      }

      // Ir a página de éxito
      window.location.href = '/pagos/exito';
    } catch (error) {
      console.error('Error:', error);
      window.location.href = '/pagos/error';
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmar pago</h1>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Orden:</span>
                <span className="font-semibold">{paymentData.orden_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-semibold text-lg">${paymentData.monto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Predicción:</span>
                <span className="font-semibold capitalize">{paymentData.prediccion}</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Modo prueba:</strong> En desarrollo, el pago se procesará automáticamente.
                En producción, se redirigirá a REDSYS para validar tarjeta.
              </p>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Confirmar y pagar
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
