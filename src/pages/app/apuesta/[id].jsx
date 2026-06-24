import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import BetForm from '../../../components/BetForm';
import Card from '../../../components/Card';
import StatsBox from '../../../components/StatsBox';
import Button from '../../../components/Button';

export default function ApuestaDetail() {
  const [user, setUser] = useState(null);
  const [apuesta, setApuesta] = useState(null);
  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(stored));

    if (!id) return;

    const fetchData = async () => {
      try {
        const [apuestaRes, valoresRes] = await Promise.all([
          fetch(`/api/apuestas/${id}`, { credentials: 'include' }),
          fetch('/api/valores', { credentials: 'include' }),
        ]);

        if (apuestaRes.ok) {
          setApuesta(await apuestaRes.json());
        }

        if (valoresRes.ok) {
          const allValores = await valoresRes.json();
          setValores(allValores.filter((v) => v.id_apuesta === id));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading || !apuesta) {
    return (
      <Layout>
        <div className="text-center py-20">Cargando apuesta...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-medium transition"
        >
          ← Volver
        </button>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {apuesta.equipo1} vs {apuesta.equipo2}
          </h1>
          <p className="text-gray-600">Detalles de la apuesta</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsBox
            title="Valor inicial"
            value={`$${apuesta.valor}`}
            color="blue"
            icon="⚽"
          />
          <StatsBox
            title="Recaudación"
            value={`$${apuesta.recaudacion_total}`}
            color="green"
            icon="💰"
          />
          <StatsBox
            title="Participantes"
            value={valores.length}
            color="blue"
            icon="👥"
          />
          <StatsBox
            title="Estado"
            value={apuesta.estado}
            color={apuesta.estado === 'abierta' ? 'green' : 'gray'}
            icon="📊"
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Bet Form */}
          <Card className="lg:col-span-1 h-fit">
            <BetForm
              apuesta={apuesta}
              participantId={user.id}
              onSuccess={() => router.replace(router.asPath)}
            />
          </Card>

          {/* Valores apostados */}
          <Card className="lg:col-span-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Apuestas registradas ({valores.length})</h3>
              {valores.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Sin apuestas aún</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Predicción</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {valores.map((v) => (
                        <tr key={v._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700 capitalize font-medium">{v.prediccion}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-900 font-semibold">${v.valor_apostado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
