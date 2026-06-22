import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import BetForm from '../../../components/BetForm';
import StatsTable from '../../../components/StatsTable';

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
          fetch(`/api/apuestas/${id}`),
          fetch('/api/valores'),
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

  if (!user || loading || !apuesta) {
    return <div className="text-center py-20 text-secondary">Cargando apuesta...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-blue-400 hover:text-blue-300 mb-6"
      >
        ← Volver
      </button>

      {/* Header */}
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {apuesta.equipo1} <span className="text-secondary">vs</span> {apuesta.equipo2}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div>
            <p className="text-secondary text-sm mb-2">Valor de apuesta</p>
            <p className="text-2xl font-bold text-primary">${apuesta.valor}</p>
          </div>
          <div>
            <p className="text-secondary text-sm mb-2">Recaudación total</p>
            <p className="text-2xl font-bold text-primary">${apuesta.recaudacion_total}</p>
          </div>
          <div>
            <p className="text-secondary text-sm mb-2">Participantes</p>
            <p className="text-2xl font-bold text-primary">{valores.length}</p>
          </div>
          <div>
            <p className="text-secondary text-sm mb-2">Estado</p>
            <p className={`text-2xl font-bold ${apuesta.estado === 'abierta' ? 'text-green-400' : 'text-gray-500'}`}>
              {apuesta.estado}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bet Form */}
        <div>
          <BetForm
            apuesta={apuesta}
            participantId={user.id}
            onSuccess={() => router.replace(router.asPath)}
          />
        </div>

        {/* Valores apostados */}
        <div className="lg:col-span-2">
          <StatsTable
            title={`Apuestas registradas (${valores.length})`}
            headers={['Predicción', 'Monto']}
            rows={valores.map((v) => ({
              prediccion: v.prediccion,
              monto: `$${v.valor_apostado}`,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
