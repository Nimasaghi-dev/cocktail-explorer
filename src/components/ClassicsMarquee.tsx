import React from 'react';
import './ClassicsMarquee.css';

const CLASSICS = ['margarita', 'negroni', 'old fashioned'];
const REPEATS = 8; // two identical halves so the loop is seamless

interface ClassicsMarqueeProps {
  onPick: (name: string) => void;
}

const ClassicsMarquee: React.FC<ClassicsMarqueeProps> = ({ onPick }) => {
  return (
    <section className="classics" aria-labelledby="classics-label">
      <p className="eyebrow classics__label" id="classics-label">Try a classic</p>
      {CLASSICS.map((name, i) => (
        <button
          key={name}
          type="button"
          className={`classics__row${i % 2 ? ' classics__row--reverse' : ''}`}
          onClick={() => onPick(name)}
          aria-label={`Search for ${name}`}
        >
          <span className="classics__track" aria-hidden="true">
            {Array.from({ length: REPEATS }, (_, j) => (
              <span
                key={j}
                className={`classics__word${j % (REPEATS / 2) === 0 ? ' classics__word--lead' : ''}`}
              >
                {name}
              </span>
            ))}
          </span>
        </button>
      ))}
    </section>
  );
};

export default ClassicsMarquee;
