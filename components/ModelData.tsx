import React from 'react';
import { getMeasurements } from '../data/profile';
import type { Measurement } from '../data/profile';

const DataItem: React.FC<{ item: Measurement }> = ({ item }) => (
  <div className="flex items-baseline justify-between gap-4 py-4 border-b border-hairline">
    <dt className="eyebrow text-ash">{item.label}</dt>
    <dd className="m-0 text-right text-ink text-[15px]">
      {item.value}
      {item.imperial && <span className="text-ash"> · {item.imperial}</span>}
    </dd>
  </div>
);

const ModelData: React.FC = () => {
  const measurements = getMeasurements();
  const midpoint = Math.ceil(measurements.length / 2);
  const columns = [measurements.slice(0, midpoint), measurements.slice(midpoint)];

  return (
    <section aria-labelledby="medidas-heading" className="fade-in max-w-4xl mx-auto px-4 sm:px-8 py-[var(--space-section)]">
      <h2 id="medidas-heading" className="text-4xl sm:text-5xl text-ink mt-0 mb-12">Medidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
        {columns.map((column, i) => (
          // Stacked on phones, the second list continues the first one's hairlines.
          <dl key={i} className={`m-0 border-hairline ${i === 0 ? 'border-t' : 'md:border-t'}`}>
            {column.map(item => <DataItem key={item.label} item={item} />)}
          </dl>
        ))}
      </div>
    </section>
  );
};

export default ModelData;
