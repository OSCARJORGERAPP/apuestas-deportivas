import { useState } from 'react';
import Button from './Button';
import Input from './Input';

export default function BetForm({ apuesta, participantId, onSuccess }) {
  const [formData, setFormData] = useState({
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
      // Iniciar pago REDSYS
      const res = await fetch('/api/pagos/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id_participante: participantId,
          id_apuesta: apuesta._id,
          prediccion: formData.prediccion,
        }),
      });

      if (!res.ok) {
        throw new Error('Error iniciando pago');
      }

      const data = await res.json();

      // Guardar datos de pago en sessionStorage y redirigir
      sessionStorage.setItem('paymentData', JSON.stringify({
        orden_id: data.orden_id,
        id_apuesta: apuesta._id,
        id_participante: participantId,
        prediccion: formData.prediccion,
        monto: data.monto,
      }));

      window.location.href = '/pagos';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Elige tu predicción</h3>

      <div className="space-y-3">
        {[
          { value: 'equipo1', label: apuesta.equipo1 },
          { value: 'empate', label: 'Empate' },
          { value: 'equipo2', label: apuesta.equipo2 },
        ].map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
            <input
              type="radio"
              name="prediccion"
              value={option.value}
              checked={formData.prediccion === option.value}
              onChange={handleChange}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="font-medium text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-600">Monto a apostar</p>
        <p className="text-2xl font-bold text-blue-900">${apuesta.valor}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant={apuesta.estado === 'abierta' ? 'primary' : 'secondary'}
        size="md"
        className="w-full"
        disabled={loading || apuesta.estado !== 'abierta'}
      >
        {loading ? 'Procesando...' : apuesta.estado === 'abierta' ? 'Apostar' : 'Apuesta cerrada'}
      </Button>
    </form>
  );
}
