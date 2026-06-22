import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ApuestaCard from '../../components/ApuestaCard';
import StatsTable from '../../components/StatsTable';

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
          fetch('/api/apuestas'),
          fetch('/api/valores'),
          fetch('/api/ganadores'),
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

  if (!user || loading) {
    return <div className="text-center py-20 text-secondary">Cargando dashboard...</div>;
  }

  const totalGanancias = ganancias.reduce((sum, g) => sum + g.valor_ganado, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-2">Dashboard</h1>
      <p className="text-secondary mb-8">Bienvenido, {user.email}</p>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-secondary text-sm mb-2">Apuestas totales</p>
          <p className="text-3xl font-bold text-primary">{misApuestas.length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-secondary text-sm mb-2">Apuestas abiertas</p>
          <p className="text-3xl font-bold text-primary">{apuestas.filter(a => a.estado === 'abierta').length}</p>
        </div>
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <p className="text-secondary text-sm mb-2">Ganancias totales</p>
          <p className="text-3xl font-bold text-green-400">${totalGanancias.toFixed(2)}</p>
        </div>
      </div>

      {/* Apuestas disponibles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-6">Apuestas disponibles</h2>
        {apuestas.length === 0 ? (
          <p className="text-secondary">No hay apuestas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apuestas.filter(a => a.estado === 'abierta').map((apuesta) => (
              <ApuestaCard key={apuesta._id} apuesta={apuesta} />
            ))}
          </div>
        )}
      </div>

      {/* Mis apuestas */}
      <div className="mb-12">
        <StatsTable
          title="Mis apuestas"
          headers={['ID Apuesta', 'Predicción', 'Monto', 'Estado']}
          rows={misApuestas.map((v) => ({
            id: v.id_apuesta.toString().slice(0, 8),
            prediccion: v.prediccion,
            monto: `$${v.valor_apostado}`,
            estado: '—',
          }))}
        />
      </div>

      {/* Mis ganancias */}
      {ganancias.length > 0 && (
        <div>
          <StatsTable
            title="Mis ganancias"
            headers={['ID Apuesta', 'Monto ganado']}
            rows={ganancias.map((g) => ({
              id: g.id_apuesta.toString().slice(0, 8),
              monto: `$${g.valor_ganado.toFixed(2)}`,
            }))}
          />
        </div>
      )}
    </div>
  );
}
