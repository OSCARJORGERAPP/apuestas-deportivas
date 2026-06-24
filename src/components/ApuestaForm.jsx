import { useState } from 'react';
import Button from './Button';
import Input from './Input';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Nueva Apuesta</h3>

      <Input
        type="text"
        name="equipo1"
        label="Equipo 1"
        value={formData.equipo1}
        onChange={handleChange}
        placeholder="ej. Real Madrid"
        required
      />

      <Input
        type="text"
        name="equipo2"
        label="Equipo 2"
        value={formData.equipo2}
        onChange={handleChange}
        placeholder="ej. Barcelona"
        required
      />

      <Input
        type="number"
        name="valor"
        label="Valor de apuesta"
        value={formData.valor}
        onChange={handleChange}
        placeholder="100"
        step="0.01"
        required
      />

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
        {loading ? 'Creando...' : 'Crear Apuesta'}
      </Button>
    </form>
  );
}
