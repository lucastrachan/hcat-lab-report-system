import Button from './Button';
import '../../styles/SampleCard.css';

const BACTERIA_PARAMS = ['Coliform Bacteria', 'E. Coli Bacteria'];

function isBacteriaParam(name) {
  return BACTERIA_PARAMS.includes(name);
}

export default function SampleCard({
  sample,
  sampleIndex,
  canRemove,
  onUpdate,
  onRemove,
  onAddCustomParam,
  onRemoveCustomParam,
}) {
  function updateField(field, value) {
    onUpdate(sampleIndex, { ...sample, [field]: value });
  }

  function updateParamValue(paramIndex, value) {
    const updated = [...sample.parameters];
    updated[paramIndex] = { ...updated[paramIndex], value };
    onUpdate(sampleIndex, { ...sample, parameters: updated });
  }

  return (
    <div className="sample-card">
      <div className="sample-card-header">
        <h3>Sample {sampleIndex + 1}</h3>
        {canRemove && (
          <Button
            variant="danger"
            size="small"
            onClick={() => onRemove(sampleIndex)}
          >
            Remove Sample
          </Button>
        )}
      </div>

      <div className="sample-card-fields">
        <div className="sample-field">
          <label htmlFor={`label-${sampleIndex}`}>Sample Label</label>
          <input
            id={`label-${sampleIndex}`}
            type="text"
            value={sample.label}
            onChange={(e) => updateField('label', e.target.value)}
            placeholder={`Sample ${sampleIndex + 1}`}
          />
        </div>
      </div>

      <table className="param-table">
        <thead>
          <tr>
            <th className="param-name-col">Parameter</th>
            <th className="param-value-col">Value</th>
            <th className="param-unit-col">Unit</th>
            <th className="param-limit-col">Rec. Limit</th>
            <th className="param-action-col"></th>
          </tr>
        </thead>
        <tbody>
          {sample.parameters.map((param, pi) => (
            <tr key={pi}>
              <td className="param-name-col">
                {param.isCustom ? (
                  <input
                    type="text"
                    value={param.name}
                    onChange={(e) => {
                      const updated = [...sample.parameters];
                      updated[pi] = { ...updated[pi], name: e.target.value };
                      onUpdate(sampleIndex, { ...sample, parameters: updated });
                    }}
                    placeholder="Parameter name"
                    className="param-inline-input"
                  />
                ) : (
                  param.name
                )}
              </td>
              <td className="param-value-col">
                <div className="param-value-wrapper">
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateParamValue(pi, e.target.value)}
                    placeholder="N/A"
                    className="param-inline-input"
                  />
                  {isBacteriaParam(param.name) && (
                    <button
                      type="button"
                      className={`bacteria-toggle ${param.value === '+' ? 'bacteria-positive' : ''}`}
                      onClick={() => updateParamValue(pi, param.value === '+' ? '' : '+')}
                      title="Toggle positive (+)"
                    >
                      +
                    </button>
                  )}
                </div>
              </td>
              <td className="param-unit-col">
                {param.isCustom ? (
                  <input
                    type="text"
                    value={param.unit}
                    onChange={(e) => {
                      const updated = [...sample.parameters];
                      updated[pi] = { ...updated[pi], unit: e.target.value };
                      onUpdate(sampleIndex, { ...sample, parameters: updated });
                    }}
                    placeholder="unit"
                    className="param-inline-input"
                  />
                ) : (
                  param.unit
                )}
              </td>
              <td className="param-limit-col">
                {param.isCustom ? (
                  <input
                    type="text"
                    value={param.recommendedLimit}
                    onChange={(e) => {
                      const updated = [...sample.parameters];
                      updated[pi] = { ...updated[pi], recommendedLimit: e.target.value };
                      onUpdate(sampleIndex, { ...sample, parameters: updated });
                    }}
                    placeholder="limit"
                    className="param-inline-input"
                  />
                ) : (
                  param.recommendedLimit
                )}
              </td>
              <td className="param-action-col">
                {param.isCustom && (
                  <button
                    type="button"
                    className="param-remove-btn"
                    onClick={() => onRemoveCustomParam(pi)}
                    title="Remove parameter"
                  >
                    &times;
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        variant="outline"
        size="small"
        onClick={() => onAddCustomParam(sampleIndex)}
        className="add-param-btn"
      >
        + Add Custom Parameter
      </Button>
    </div>
  );
}
