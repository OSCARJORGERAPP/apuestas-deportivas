import Link from 'next/link';

export default function ApuestaCard({ apuesta }) {
  const estadoColor = {
    abierta: 'bg-green-900 text-green-200',
    cerrada: 'bg-gray-800 text-gray-400',
  };

  return (
    <Link href={`/app/apuesta/${apuesta._id}`}>
      <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-dark-600 hover:bg-dark-700 transition cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-primary">
              {apuesta.equipo1} <span className="text-secondary">vs</span> {apuesta.equipo2}
            </h3>
            <p className="text-secondary text-sm mt-1">Apuesta #{apuesta.indice}</p>
          </div>
          <span className={`px-3 py-1 rounded text-xs font-semibold ${estadoColor[apuesta.estado] || 'bg-gray-700'}`}>
            {apuesta.estado}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-secondary text-xs">Valor</p>
            <p className="text-primary font-semibold">${apuesta.valor}</p>
          </div>
          <div>
            <p className="text-secondary text-xs">Recaudado</p>
            <p className="text-primary font-semibold">${apuesta.recaudacion_total}</p>
          </div>
          <div>
            <p className="text-secondary text-xs">Estado</p>
            <p className="text-primary font-semibold">{apuesta.resultado || '—'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
