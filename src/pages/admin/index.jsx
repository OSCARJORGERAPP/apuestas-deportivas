import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Tabs from '../../components/Tabs';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ApuestaForm from '../../components/ApuestaForm';

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
      const res = await fetch(`/api/${collection}?reset=true`, { method: 'DELETE', credentials: 'include' });

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
        credentials: 'include',
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

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Cargando admin...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Panel Admin</h1>
          <p className="text-gray-600">Gestiona apuestas, participantes y resultados</p>
        </div>

        <Tabs tabs={['apuestas', 'participantes', 'acciones']} active={activeTab} onChange={setActiveTab} />

        {/* Apuestas Tab */}
        {activeTab === 'apuestas' && (
          <div className="space-y-8">
            <Card>
              <ApuestaForm onSuccess={() => router.replace(router.asPath)} />
            </Card>

            <Card>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Apuestas ({apuestas.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Equipos</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Valor</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Recaudado</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Estado</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Resultado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {apuestas.map((a) => (
                        <tr key={a._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-700 font-medium">{a.equipo1} vs {a.equipo2}</td>
                          <td className="py-3 px-4 text-sm text-right text-gray-700">${a.valor}</td>
                          <td className="py-3 px-4 text-sm text-right text-blue-600 font-semibold">${a.recaudacion_total}</td>
                          <td className="py-3 px-4 text-sm text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              a.estado === 'abierta' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {a.estado}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-center text-gray-700">{a.resultado || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Participantes Tab */}
        {activeTab === 'participantes' && (
          <Card>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Participantes ({participantes.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nombre</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Índice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participantes.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-700 font-medium">{p.nombre}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{p.mail}</td>
                        <td className="py-3 px-4 text-sm text-center text-gray-700">{p.indice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* Acciones Tab */}
        {activeTab === 'acciones' && (
          <div className="space-y-6">
            <Card>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Establecer resultado</h3>
                <form onSubmit={handleSetResultado} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apuesta</label>
                      <select
                        value={resultadoForm.id}
                        onChange={(e) => setResultadoForm({ ...resultadoForm, id: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resultado</label>
                      <select
                        value={resultadoForm.resultado}
                        onChange={(e) => setResultadoForm({ ...resultadoForm, resultado: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="equipo1">Equipo 1</option>
                        <option value="empate">Empate</option>
                        <option value="equipo2">Equipo 2</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" variant="primary">
                    Establecer resultado
                  </Button>
                </form>
              </div>
            </Card>

            <Card>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Reseteos</h3>
                <p className="text-sm text-gray-600 mb-6">Acciones destructivas. No se pueden deshacer.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['apuestas', 'participantes', 'valores', 'ganadores'].map((col) => (
                    <Button
                      key={col}
                      variant="danger"
                      size="md"
                      onClick={() => handleReset(col)}
                      className="w-full"
                    >
                      Resetear {col}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
