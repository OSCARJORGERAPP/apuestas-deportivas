import { useState } from 'react';
import Link from 'next/link';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600 block mb-2">
            ⚽ Apuestas
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
          <p className="text-gray-600 text-sm mt-1">Accede con tu email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={loading}
          />

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar magic link'}
          </Button>
        </form>

        <p className="text-gray-500 text-xs mt-6 text-center">
          Testing: <a href="http://localhost:8025" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">ver emails</a>
        </p>
      </div>
    </div>
  );
}
