import { useState, useEffect } from 'react';
import '../../styles/DrinkingWaterGuide.css';

function paramToId(name) {
  return 'guide-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function DrinkingWaterGuide({ parameters, expandedParam }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const uniqueParams = [];
  const seen = new Set();
  for (const param of parameters) {
    if (param.description && !seen.has(param.name)) {
      seen.add(param.name);
      uniqueParams.push(param);
    }
  }

  useEffect(() => {
    if (!expandedParam) return;
    const idx = uniqueParams.findIndex((p) => p.name === expandedParam);
    if (idx !== -1) {
      setExpandedIndex(idx);
      const el = document.getElementById(paramToId(expandedParam));
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    }
  }, [expandedParam]);

  if (uniqueParams.length === 0) return null;

  function toggle(index) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className="drinking-water-guide">
      <h2 className="guide-title">Understanding Your Drinking Water</h2>
      <p className="guide-intro">
        Learn what each parameter means, what the recommended limits are, and
        what actions to take if your results fall outside the expected range.
      </p>

      <div className="guide-list">
        {uniqueParams.map((param, index) => {
          const isOpen = expandedIndex === index;
          return (
            <div
              key={param.name}
              id={paramToId(param.name)}
              className={`guide-item ${isOpen ? 'guide-item-open' : ''}`}
            >
              <button
                type="button"
                className="guide-item-header"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <div className="guide-item-title">
                  <span className="guide-param-name">{param.name}</span>
                  <span className="guide-param-limit">
                    Limit: {param.recommendedLimit} {param.unit}
                  </span>
                </div>
                <span className="guide-chevron">{isOpen ? '\u25B2' : '\u25BC'}</span>
              </button>

              {isOpen && (
                <div className="guide-item-body">
                  <div className="guide-section">
                    <h4>What is it?</h4>
                    <p>{param.description}</p>
                  </div>
                  {param.recommendedAction && (
                    <div className="guide-section">
                      <h4>Recommended Action</h4>
                      <p>{param.recommendedAction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
