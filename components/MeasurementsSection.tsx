import React from 'react';
import { SectionHeading } from './BookSection';
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

const MeasurementsSection: React.FC = () => {
  const measurements = getMeasurements();

  return (
    <section id="medidas" aria-labelledby="medidas-heading" className="max-w-7xl mx-auto px-4 sm:px-8 pt-[var(--space-section)] scroll-mt-14">
      <div className="-mx-4 sm:mx-0">
        <SectionHeading id="medidas-heading" number="03" title="Medidas" />
      </div>
      {/* Kept to the width of a spec sheet: wider, labels and values drift too far apart. */}
      <dl className="m-0 max-w-4xl border-t border-hairline grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
        {measurements.map(item => <DataItem key={item.label} item={item} />)}
      </dl>
    </section>
  );
};

export default MeasurementsSection;
