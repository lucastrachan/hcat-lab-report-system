import { useState } from 'react';
import '../../styles/ResultsTable.css';

export default function ResultsTable({ samples }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!samples || samples.length === 0) return null;

  const activeSample = samples[activeTab];

  function formatValue(value) {
    if (!value || value.trim() === '') return 'N/A';
    return value;
  }

  return (
    <div className="results-table-wrapper">
      <h2 className="section-title">Test Results</h2>

      {samples.length > 1 && (
        <div className="results-tabs">
          {samples.map((s, i) => (
            <button
              key={s.sampleId || i}
              className={`results-tab ${activeTab === i ? 'results-tab-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {s.label || `Sample ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="results-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th className="results-param-col">Parameter</th>
              <th className="results-value-col">Result</th>
              <th className="results-unit-col">Unit</th>
              <th className="results-limit-col">Rec. Limit</th>
            </tr>
          </thead>
          <tbody>
            {activeSample.parameters.map((param) => {
              const val = formatValue(param.value);
              const isPositive = val === '+';
              return (
                <tr key={param.name}>
                  <td className="results-param-col">{param.name}</td>
                  <td
                    className={`results-value-col ${isPositive ? 'value-positive' : ''} ${val === 'N/A' ? 'value-na' : ''}`}
                  >
                    {val}
                  </td>
                  <td className="results-unit-col">{param.unit}</td>
                  <td className="results-limit-col">{param.recommendedLimit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
