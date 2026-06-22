import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthVerify() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);

        if (!res.ok) {
          throw new Error('Token inválido o expirado');
        }

        const data = await res.json();

        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirigir al dashboard
        router.push('/app');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    verify();
  }, [token, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-primary text-2xl">Verificando token...</p>
          <p className="text-secondary mt-2">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-2xl">❌ {error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-primary"
          >
            Volver a login
          </button>
        </div>
      </div>
    );
  }

  return null;
}
