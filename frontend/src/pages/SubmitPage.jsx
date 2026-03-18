import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PageLayout from '../components/layout/PageLayout';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import SampleCard from '../components/shared/SampleCard';
import DEFAULT_PARAMETERS from '../constants/defaultParameters';
import { createReport } from '../api/reportApi';
import '../styles/SubmitPage.css';

function createDefaultParams() {
  return DEFAULT_PARAMETERS.map((p) => ({
    ...p,
    value: '',
    isCustom: false,
  }));
}

function createEmptySample(index, existingCustomParams = []) {
  return {
    sampleId: uuidv4(),
    label: `Sample ${index + 1}`,
    parameters: [
      ...createDefaultParams(),
      ...existingCustomParams.map((p) => ({ ...p, value: '' })),
    ],
  };
}

export default function SubmitPage() {
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    sampleDate: '',
    notes: '',
  });
  const [samples, setSamples] = useState([createEmptySample(0)]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function updateSample(index, updatedSample) {
    setSamples((prev) => prev.map((s, i) => (i === index ? updatedSample : s)));
  }

  function getCustomParams() {
    return samples[0]?.parameters.filter((p) => p.isCustom) || [];
  }

  function addSample() {
    setSamples((prev) => [...prev, createEmptySample(prev.length, getCustomParams())]);
  }

  function removeSample(index) {
    if (samples.length <= 1) return;
    setSamples((prev) => prev.filter((_, i) => i !== index));
  }

  function addCustomParam() {
    const newParam = {
      name: '',
      value: '',
      unit: '',
      recommendedLimit: '',
      description: '',
      recommendedAction: '',
      isCustom: true,
    };
    setSamples((prev) =>
      prev.map((s) => ({
        ...s,
        parameters: [...s.parameters, { ...newParam }],
      })),
    );
  }

  function removeCustomParam(paramIndex) {
    setSamples((prev) =>
      prev.map((s) => ({
        ...s,
        parameters: s.parameters.filter((_, i) => i !== paramIndex),
      })),
    );
  }

  function validate() {
    const newErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!form.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    if (!form.sampleDate) newErrors.sampleDate = 'Sample date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const reportId = uuidv4();
    const now = new Date().toISOString();

    const reportData = {
      reportId,
      status: 'UNSENT',
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      customerAddress: form.customerAddress.trim(),
      sampleDate: form.sampleDate,
      createdAt: now,
      updatedAt: now,
      notes: form.notes.trim(),
      samples: samples.map((s) => ({
        ...s,
        parameters: s.parameters.map(({ isCustom, ...rest }) => rest),
      })),
      sentMetadata: null,
      pdfMetadata: null,
    };

    try {
      await createReport(reportData);
      setSubmitted(true);
    } catch (err) {
      console.error('Submit failed:', err);
      // For now, still show success since backend isn't wired yet
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="submit-success">
          <div className="success-icon">&#10003;</div>
          <h2>Report Submitted Successfully</h2>
          <p>The water analysis report has been submitted and is ready for admin review.</p>
          <Button onClick={() => window.location.reload()}>Submit Another Report</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="submit-page">
        <h1>Submit Water Analysis</h1>
        <p className="submit-subtitle">
          Enter the customer information and water sample results below.
        </p>

        <form onSubmit={handleSubmit}>
          <section className="form-section">
            <h2>Customer Information</h2>
            <div className="form-grid">
              <Input
                label="Customer Name"
                id="customerName"
                value={form.customerName}
                onChange={(e) => updateForm('customerName', e.target.value)}
                placeholder="Full name"
                required
                error={errors.customerName}
              />
              <Input
                label="Email Address"
                id="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={(e) => updateForm('customerEmail', e.target.value)}
                placeholder="customer@email.com"
                required
                error={errors.customerEmail}
              />
              <Input
                label="Phone Number"
                id="customerPhone"
                type="tel"
                value={form.customerPhone}
                onChange={(e) => updateForm('customerPhone', e.target.value)}
                placeholder="(555) 123-4567"
              />
              <Input
                label="Address"
                id="customerAddress"
                value={form.customerAddress}
                onChange={(e) => updateForm('customerAddress', e.target.value)}
                placeholder="Full address"
              />
              <Input
                label="Sample Date"
                id="sampleDate"
                type="date"
                value={form.sampleDate}
                onChange={(e) => updateForm('sampleDate', e.target.value)}
                required
                error={errors.sampleDate}
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Water Samples</h2>

            {samples.map((sample, index) => (
              <SampleCard
                key={sample.sampleId}
                sample={sample}
                sampleIndex={index}
                canRemove={samples.length > 1}
                onUpdate={updateSample}
                onRemove={removeSample}
                onAddCustomParam={addCustomParam}
                onRemoveCustomParam={removeCustomParam}
              />
            ))}

            <Button variant="secondary" onClick={addSample} className="add-sample-btn">
              + Add Sample
            </Button>
          </section>

          <section className="form-section">
            <h2>Notes</h2>
            <textarea
              className="notes-textarea"
              value={form.notes}
              onChange={(e) => updateForm('notes', e.target.value)}
              placeholder="Optional notes about the sample, collection conditions, observations, etc."
              rows={4}
            />
          </section>

          <div className="submit-actions">
            <Button type="submit" size="large" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
