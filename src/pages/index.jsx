import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApuestaCard from '../components/ApuestaCard';
import Button from '../components/Button';

export default function Home() {
  const [apuestas, setApuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApuestas = async () => {
      try {
        const res = await fetch('/api/apuestas');
        if (res.ok) {
          const data = await res.json();
          setApuestas(data);
        }
      } catch (error) {
        console.error('Error fetching apuestas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApuestas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">⚽ Apuestas Deportivas</h1>
          <Link href="/login">
            <Button variant="primary" size="md">Entrar
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-32 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Apuestas Deportivas Inteligentes
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Participa en apuestas deportivas y gana proporcionalmente con otros ganadores. Sin complicaciones, sin intermediarios.
          </p>
          <Link href="/login">
            <Button variant="primary" size="lg">
              Comenzar a Apostar
            </Button>
          </Link>
        </div>
      </section>

      {/* Apuestas */}
      <section className="py-16 px-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Apuestas disponibles
          </h3>

          {loading ? (
            <div className="text-center text-gray-600">Cargando apuestas...</div>
          ) : apuestas.length === 0 ? (
            <div className="text-center text-gray-600">No hay apuestas disponibles</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apuestas.map((apuesta) => (
                <ApuestaCard key={apuesta._id} apuesta={apuesta} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-16">
            ¿Cómo funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📧', title: 'Regístrate', desc: 'Con tu email, sin contraseña' },
              { icon: '⚽', title: 'Apuesta', desc: 'Elige equipos y montos' },
              { icon: '🏆', title: 'Gana', desc: 'Distribución proporcional' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <p>⚽ Apuestas Deportivas © 2026</p>
      </footer>
    </div>
  );
}
