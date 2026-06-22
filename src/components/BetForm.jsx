import { useState } from 'react';

export default function BetForm({ apuesta, participantId, onSuccess }) {
  const [formData, setFormData] = useState({
    valor_apostado: '',
    prediccion: 'equipo1',
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
      const res = await fetch('/api/valores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_participante: participantId,
          id_apuesta: apuesta._id,
          valor_apostado: parseFloat(formData.valor_apostado),
          prediccion: formData.prediccion,
        }),
      });

      if (!res.ok) {
        throw new Error('Error registrando apuesta');
      }

      setFormData({ valor_apostado: '', prediccion: 'equipo1' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-primary">Apuesta por:</h3>

      <div className="grid grid-cols-3 gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="prediccion"
            value="equipo1"
            checked={formData.prediccion === 'equipo1'}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-primary">{apuesta.equipo1}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="prediccion"
            value="empate"
            checked={formData.prediccion === 'empate'}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-primary">Empate</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="prediccion"
            value="equipo2"
            checked={formData.prediccion === 'equipo2'}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-primary">{apuesta.equipo2}</span>
        </label>
      </div>

      <div>
        <label className="block text-secondary text-sm mb-2">Monto a apostar</label>
        <input
          type="number"
          name="valor_apostado"
          value={formData.valor_apostado}
          onChange={handleChange}
          placeholder="50"
          step="0.01"
          min="1"
          className="w-full bg-dark-900 border border-dark-600 rounded px-3 py-2 text-primary placeholder-dark-500 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || apuesta.estado !== 'abierta'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-4 py-2 rounded text-primary font-semibold transition"
      >
        {loading ? 'Procesando...' : 'Apostar'}
      </button>
    </form>
  );
}
