import { useState } from 'react';

export default function ApuestaForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    equipo1: '',
    equipo2: '',
    valor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/apuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipo1: formData.equipo1,
          equipo2: formData.equipo2,
          valor: parseFloat(formData.valor),
        }),
      });

      if (!res.ok) {
        throw new Error('Error creando apuesta');
      }

      setFormData({ equipo1: '', equipo2: '', valor: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-primary">Nueva Apuesta</h3>

      <div>
        <label className="block text-secondary text-sm mb-2">Equipo 1</label>
        <input
          type="text"
          name="equipo1"
          value={formData.equipo1}
          onChange={handleChange}
          placeholder="ej. Real Madrid"
          className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary placeholder-dark-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-secondary text-sm mb-2">Equipo 2</label>
        <input
          type="text"
          name="equipo2"
          value={formData.equipo2}
          onChange={handleChange}
          placeholder="ej. Barcelona"
          className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary placeholder-dark-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-secondary text-sm mb-2">Valor de apuesta</label>
        <input
          type="number"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          placeholder="100"
          step="0.01"
          className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary placeholder-dark-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-2 rounded text-primary font-semibold transition"
      >
        {loading ? 'Creando...' : 'Crear Apuesta'}
      </button>
    </form>
  );
}
