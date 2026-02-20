import React from 'react';

const DataItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <li className="flex justify-between items-center py-4 border-b border-neutral-200 group hover:border-neutral-400 transition-colors">
    <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-semibold group-hover:text-neutral-700 transition-colors">{label}</span>
    <span className="text-lg text-neutral-900 font-light">{value}</span>
  </li>
);

const ModelData: React.FC = () => {
  const modelData = [
    { label: 'Altura', value: '1,85 m' },
    { label: 'Fecha de nac.', value: '06/11/2006' },
    { label: 'Busto', value: '92 cm' },
    { label: 'Cintura', value: '75 cm' },
    { label: 'Cadera', value: '97 cm' },
    { label: 'Pantalón', value: '30' },
    { label: 'Remera', value: 'M–L' },
    { label: 'Calzado', value: '43' },
    { label: 'Cabello', value: 'Negro' },
    { label: 'Ojos', value: 'Marrones' },
  ];

  const midpoint = Math.ceil(modelData.length / 2);
  const column1Data = modelData.slice(0, midpoint);
  const column2Data = modelData.slice(midpoint);

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 animate-fade-in relative z-10">

      <h2
        className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-16 tracking-wide font-['Bodoni_Moda']"
      >
        Medidas
      </h2>

      <div className="glass-panel p-8 md:p-16 rounded-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          <ul className="flex flex-col">
            {column1Data.map(item => (
              <DataItem key={item.label} label={item.label} value={item.value} />
            ))}
          </ul>
          <ul className="flex flex-col">
            {column2Data.map(item => (
              <DataItem key={item.label} label={item.label} value={item.value} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModelData;
