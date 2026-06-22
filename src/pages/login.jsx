import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Error enviando magic link');
      }

      setMessage('✅ Magic link enviado a tu email. Revisa tu bandeja de entrada.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2">Bienvenido</h1>
        <p className="text-secondary mb-8">Accede con tu email</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-dark-900 border border-dark-600 rounded px-4 py-2 text-primary placeholder-dark-500 focus:border-blue-500 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

          {message && <p className="text-green-400 text-sm">{message}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded text-primary font-semibold transition"
          >
            {loading ? 'Enviando...' : 'Enviar magic link'}
          </button>
        </form>

        <p className="text-secondary text-xs mt-6 text-center">
          MailHog en dev: <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer" className="text-blue-400">localhost:8025</a>
        </p>
      </div>
    </div>
  );
}
