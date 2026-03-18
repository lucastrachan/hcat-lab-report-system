import { useState } from 'react';
import { getStatus, getBarPercent, parseLimit } from '../../utils/parameterStatus';
import '../../styles/ResultsTable.css';

const STATUS_COLORS = {
  in_range: '#d6eaf8',
  edge: '#fdebd0',
  out_of_range: '#fadbd8',
  na: '#e5e7eb',
};

export default function ResultsTable({ samples, onParamClick }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!samples || samples.length === 0) return null;

  const activeSample = samples[activeTab];

  function formatValue(value) {
    if (!value || value.trim() === '') return 'N/A';
    return value;
  }

  function isOdorType(param) {
    return param.recommendedLimit === 'Odor' || !parseLimit(param.recommendedLimit);
  }

  function handleRowClick(paramName) {
    if (onParamClick) onParamClick(paramName);
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
              <th className="rt-col-param">Parameter</th>
              <th className="rt-col-result">Result</th>
              <th className="rt-col-method">Method</th>
              <th className="rt-col-mandatory">Regulatory</th>
            </tr>
          </thead>
          <tbody>
            {activeSample.parameters.map((param) => {
              const val = formatValue(param.value);
              const isBacteria = param.recommendedLimit?.includes('Absent');
              const isOdor = isOdorType(param) && !isBacteria;
              const status = getStatus(param.value, param.recommendedLimit);
              const barPercent = status === 'out_of_range' ? 100 : getBarPercent(param.value, param.recommendedLimit);
              const barColor = STATUS_COLORS[status];

              return (
                <tr
                  key={param.name}
                  className="rt-row-clickable"
                  onClick={() => handleRowClick(param.name)}
                  title={`Learn more about ${param.name}`}
                >
                  <td className="rt-col-param">{param.name}</td>
                  <td className="rt-col-result">
                    {val === 'N/A' ? (
                      <span className="rt-na">N/A</span>
                    ) : isBacteria ? (
                      <span className={`rt-bacteria rt-status-${status}`}>
                        {status === 'out_of_range' ? (
                          <span className="rt-danger-icon" title="Out of range">&#9888;</span>
                        ) : (
                          <span className="rt-check-icon">&#10003;</span>
                        )}
                        {val === '+' ? 'Detected' : 'Not Detected'}
                      </span>
                    ) : isOdor ? (
                      <span className="rt-odor">
                        {val !== 'N/A' ? `${val} ${param.unit}` : 'None detected'}
                      </span>
                    ) : (
                      <div className="rt-bar-container">
                        <div
                          className="rt-bar-fill"
                          style={{ width: `${barPercent}%`, backgroundColor: barColor }}
                        />
                        <div className="rt-bar-label">
                          <span className="rt-bar-value">{val} {param.unit}</span>
                          <span className="rt-bar-limit">{param.recommendedLimit}</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="rt-col-method">{param.method || '—'}</td>
                  <td className="rt-col-mandatory">
                    {param.mandatoryLimit ? (
                      <span className="rt-mandatory-badge">{param.mandatoryLimit}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
