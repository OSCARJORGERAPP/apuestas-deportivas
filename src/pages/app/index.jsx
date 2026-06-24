import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ApuestaCard from '../../components/ApuestaCard';
import StatsBox from '../../components/StatsBox';
import Card from '../../components/Card';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [apuestas, setApuestas] = useState([]);
  const [misApuestas, setMisApuestas] = useState([]);
  const [ganancias, setGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(stored));

    const fetchData = async () => {
      try {
        const [apuestasRes, valoresRes, gananciasRes] = await Promise.all([
          fetch('/api/apuestas', { credentials: 'include' }),
          fetch('/api/valores', { credentials: 'include' }),
          fetch('/api/ganadores', { credentials: 'include' }),
        ]);

        if (apuestasRes.ok) setApuestas(await apuestasRes.json());
        if (valoresRes.ok) setMisApuestas(await valoresRes.json());
        if (gananciasRes.ok) setGanancias(await gananciasRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Cargando dashboard...</div>
      </Layout>
    );
  }

  const totalGanancias = ganancias.reduce((sum, g) => sum + g.valor_ganado, 0);
  const apuestasAbiertas = apuestas.filter(a => a.estado === 'abierta');

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, <span className="font-semibold">{user?.email}</span></p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsBox
            title="Apuestas realizadas"
            value={misApuestas.length}
            icon="🎯"
            color="blue"
          />
          <StatsBox
            title="Apuestas abiertas"
            value={apuestasAbiertas.length}
            icon="⚽"
            color="blue"
          />
          <StatsBox
            title="Ganancias totales"
            value={`$${totalGanancias.toFixed(2)}`}
            icon="🏆"
            color="green"
          />
        </div>

        {/* Apuestas disponibles */}
        {apuestasAbiertas.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apuestas disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apuestasAbiertas.map((apuesta) => (
                <ApuestaCard key={apuesta._id} apuesta={apuesta} />
              ))}
            </div>
          </div>
        )}

        {/* Mis apuestas */}
        {misApuestas.length > 0 && (
          <Card>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mis apuestas</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Apuesta</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Predicción</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {misApuestas.map((v) => (
                      <tr key={v._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700">{v.id_apuesta.toString().slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 capitalize">{v.prediccion}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">${v.valor_apostado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* Ganancias */}
        {ganancias.length > 0 && (
          <Card>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Mis ganancias</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Apuesta</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Ganancia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {ganancias.map((g) => (
                      <tr key={g._id} className="hover:bg-green-50">
                        <td className="py-3 px-4 text-sm text-gray-700">{g.id_apuesta.toString().slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm text-right font-bold text-green-600">${g.valor_ganado.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
