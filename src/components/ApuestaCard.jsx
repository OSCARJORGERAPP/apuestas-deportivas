import Link from 'next/link';
import Card from './Card';
import Button from './Button';

export default function ApuestaCard({ apuesta }) {
  const statusColor = {
    abierta: 'bg-blue-100 text-blue-800',
    cerrada: 'bg-gray-100 text-gray-800',
    completada: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="hover:shadow-md transition">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              {apuesta.equipo1} vs {apuesta.equipo2}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[apuesta.estado] || 'bg-gray-100'}`}>
              {apuesta.estado}
            </span>
          </div>
          <p className="text-sm text-gray-600">⚽ Apuesta deportiva</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Valor inicial</p>
            <p className="text-lg font-bold text-gray-900">${apuesta.valor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Recaudación</p>
            <p className="text-lg font-bold text-blue-600">${apuesta.recaudacion_total}</p>
          </div>
        </div>

        {apuesta.resultado && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700">Resultado: <span className="font-bold">{apuesta.resultado}</span></p>
          </div>
        )}

        <Link href={`/app/apuesta/${apuesta._id}`} className="block">
          <Button variant="primary" className="w-full" size="md">
            Ver detalles
          </Button>
        </Link>
      </div>
    </Card>
  );
}
