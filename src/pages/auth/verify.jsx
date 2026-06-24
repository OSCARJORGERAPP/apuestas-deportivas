import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';

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
        localStorage.setItem('user', JSON.stringify(data.user));
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificando acceso...</h2>
          <p className="text-gray-600">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md shadow-lg border border-gray-200">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">Hubo un problema verificando tu token. Probablemente haya expirado.</p>
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Volver a login
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
