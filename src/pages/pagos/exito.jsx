import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function PagoExito() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <div className="text-center space-y-6">
            <div className="text-6xl">✅</div>
            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">¡Pago exitoso!</h1>
              <p className="text-gray-600">Tu apuesta ha sido registrada</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Ahora puedes ver tu apuesta en el dashboard y esperar los resultados.
              </p>
            </div>

            <Button
              onClick={() => router.push('/app')}
              variant="primary"
              className="w-full"
            >
              Ir al dashboard
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
