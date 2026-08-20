import { useState } from 'react';
import styles from './EnergyTypeIndex.module.css';

const energyTypes = [
  {
    rating: 'Green',
    types: ['Biomass', 'Non-pumped hydro', 'Nuclear', 'Pumped storage', 'Wind turbines'],
  },
  {
    rating: 'Neutral',
    types: [
      'Interconnect: Eleclink',
      'Interconnect: Ireland',
      'Interconnect: France',
      'Interconnect: IFA2',
      'Interconnect: N. Ireland',
      'Interconnect: Netherlands',
      'Interconnect: Belgium',
      'Interconnect: Norway',
      'Interconnect: Denmark',
      'Miscellaneous',
    ],
  },
  {
    rating: 'Not Green',
    types: ['Gas turbine', 'Coal fired', 'Oil fired'],
  },
];

function EnergyTypeIndex() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`${styles.index} ${isOpen ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls="energy-type-details"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.toggleLabel}>Energy index</span>
        <span className={styles.chevron} aria-hidden="true">›</span>
      </button>

      <div id="energy-type-details" className={styles.panel} aria-hidden={!isOpen}>
        <h2>Energy type index</h2>
        <p className={styles.intro}>How each source is classified in the chart.</p>

        <div className={styles.groups}>
          {energyTypes.map(({ rating, types }) => (
            <section key={rating} className={styles.group}>
              <h3>
                <span className={styles[rating.replace(' ', '')]} />
                {rating}
              </h3>
              <ul>
                {types.map((type) => <li key={type}>{type}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default EnergyTypeIndex;
