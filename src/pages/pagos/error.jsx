import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function PagoError() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center space-y-6">
            <div className="text-6xl">❌</div>
            <div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Pago rechazado</h1>
              <p className="text-gray-600">No se pudo procesar tu pago</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Por favor, intenta nuevamente con otra tarjeta o contacta al banco.
              </p>
            </div>

            <Button
              onClick={() => router.back()}
              variant="primary"
              className="w-full"
            >
              Volver a intentar
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
