import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApuestaCard from '../components/ApuestaCard';

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
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">🎯 Apuestas Deportivas</h1>
        <p className="text-xl text-secondary mb-8">
          Participa en apuestas deportivas, gana proporcionalmente con otros ganadores
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-primary font-bold transition"
        >
          Comenzar a Apostar
        </Link>
      </section>

      {/* Apuestas disponibles */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary mb-8">Apuestas disponibles</h2>

        {loading ? (
          <p className="text-secondary">Cargando apuestas...</p>
        ) : apuestas.length === 0 ? (
          <p className="text-secondary">No hay apuestas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apuestas.map((apuesta) => (
              <ApuestaCard key={apuesta._id} apuesta={apuesta} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-dark-900 rounded-lg">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-2">1. Regístrate</h3>
            <p className="text-secondary">Magic link por email, sin contraseña</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-2">2. Apuesta</h3>
            <p className="text-secondary">Elige equipos y montos, paga con REDSYS</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-2">3. Gana</h3>
            <p className="text-secondary">Distribución proporcional entre ganadores</p>
          </div>
        </div>
      </section>
    </div>
  );
}
