import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ApuestaForm from '../../components/ApuestaForm';
import StatsTable from '../../components/StatsTable';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [apuestas, setApuestas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apuestas');
  const [resultadoForm, setResultadoForm] = useState({ id: '', resultado: 'equipo1' });
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }

    const u = JSON.parse(stored);
    if (u.role !== 'admin') {
      router.push('/app');
      return;
    }

    setUser(u);

    const fetchData = async () => {
      try {
        const [apuestasRes, participantesRes] = await Promise.all([
          fetch('/api/apuestas'),
          fetch('/api/participantes'),
        ]);

        if (apuestasRes.ok) setApuestas(await apuestasRes.json());
        if (participantesRes.ok) setParticipantes(await participantesRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleReset = async (collection) => {
    if (!confirm(`¿Confirmas que quieres resetear ${collection}?`)) return;

    try {
      const res = await fetch(`/api/${collection}?reset=true`, { method: 'DELETE' });

      if (res.ok) {
        alert(`${collection} reseteado`);
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  const handleSetResultado = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/apuestas/${resultadoForm.id}/resultado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultado: resultadoForm.resultado }),
      });

      if (res.ok) {
        alert('Resultado establecido');
        setResultadoForm({ id: '', resultado: 'equipo1' });
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error('Error setting resultado:', error);
    }
  };

  if (!user || loading) {
    return <div className="text-center py-20 text-secondary">Cargando admin...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">🔧 Panel Admin</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-dark-700">
        {['apuestas', 'participantes', 'acciones'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === tab
                ? 'text-primary border-b-2 border-blue-500'
                : 'text-secondary hover:text-primary'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Apuestas Tab */}
      {activeTab === 'apuestas' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ApuestaForm onSuccess={() => router.replace(router.asPath)} />
          </div>

          <StatsTable
            title={`Apuestas (${apuestas.length})`}
            headers={['Equipos', 'Valor', 'Recaudado', 'Estado', 'Resultado']}
            rows={apuestas.map((a) => ({
              equipos: `${a.equipo1} vs ${a.equipo2}`,
              valor: `$${a.valor}`,
              recaudado: `$${a.recaudacion_total}`,
              estado: a.estado,
              resultado: a.resultado || '—',
            }))}
          />
        </div>
      )}

      {/* Participantes Tab */}
      {activeTab === 'participantes' && (
        <StatsTable
          title={`Participantes (${participantes.length})`}
          headers={['Nombre', 'Email', 'Índice']}
          rows={participantes.map((p) => ({
            nombre: p.nombre,
            email: p.mail,
            indice: p.indice,
          }))}
        />
      )}

      {/* Acciones Tab */}
      {activeTab === 'acciones' && (
        <div className="space-y-6">
          {/* Set Resultado */}
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Establecer resultado</h3>
            <form onSubmit={handleSetResultado} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-secondary text-sm mb-2">Seleccionar apuesta</label>
                  <select
                    value={resultadoForm.id}
                    onChange={(e) => setResultadoForm({ ...resultadoForm, id: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary"
                    required
                  >
                    <option value="">— Elige una apuesta —</option>
                    {apuestas.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.equipo1} vs {a.equipo2}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-secondary text-sm mb-2">Resultado</label>
                  <select
                    value={resultadoForm.resultado}
                    onChange={(e) => setResultadoForm({ ...resultadoForm, resultado: e.target.value })}
                    className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary"
                  >
                    <option value="equipo1">Equipo 1</option>
                    <option value="empate">Empate</option>
                    <option value="equipo2">Equipo 2</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-primary font-semibold transition"
              >
                Establecer resultado
              </button>
            </form>
          </div>

          {/* Resets */}
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-primary mb-4">⚠️ Reseteos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['apuestas', 'participantes', 'valores', 'ganadores'].map((col) => (
                <button
                  key={col}
                  onClick={() => handleReset(col)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-primary font-semibold transition text-sm"
                >
                  Resetear {col}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
