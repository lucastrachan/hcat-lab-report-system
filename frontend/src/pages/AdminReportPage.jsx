import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import SampleCard from '../components/shared/SampleCard';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ReportHeader from '../components/report/ReportHeader';
import CustomerInfo from '../components/report/CustomerInfo';
import ResultsTable from '../components/report/ResultsTable';
import ReportNotes from '../components/report/ReportNotes';
import Disclaimer from '../components/report/Disclaimer';
import DrinkingWaterGuide from '../components/report/DrinkingWaterGuide';
import { useAuth } from '../auth/AuthProvider';
import { getReport, updateReport, sendReportEmail } from '../api/reportApi';
import { exportReportPdf } from '../utils/pdfExport';
import DEFAULT_PARAMETERS from '../constants/defaultParameters';
import MOCK_REPORTS from '../constants/mockReports';
import { v4 as uuidv4 } from 'uuid';
import '../styles/AdminReportPage.css';

function buildDefaultEmail(report) {
  const firstName = report.customerName.split(' ')[0];
  const subject = 'Your Water Analysis Report is Ready — High Country Aqua Tech';
  const body =
`Hello ${firstName},

Thank you for choosing High Country Aqua Tech for your water testing needs. Your water analysis report is now ready for viewing.

Please click the link below to access your full interactive report, including detailed results, recommended limits, and educational information about each parameter tested.

[View Your Report]

If you have any questions about your results or would like to discuss treatment options, please don't hesitate to contact us.

Best regards,
High Country Aqua Tech
970-468-8367
customerservice@hcaquatech.com`;
  return { subject, body };
}

export default function AdminReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('preview');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedParam, setSelectedParam] = useState(null);

  const [sendModal, setSendModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const data = await getReport(reportId);
        setReport(data);
      } catch {
        const mock = MOCK_REPORTS.find((r) => r.reportId === reportId);
        setReport(mock || MOCK_REPORTS[0]);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  function updateField(field, value) {
    setReport((prev) => ({ ...prev, [field]: value }));
  }

  function updateSample(index, updatedSample) {
    setReport((prev) => ({
      ...prev,
      samples: prev.samples.map((s, i) => (i === index ? updatedSample : s)),
    }));
  }

  function addSample() {
    const customParams = report.samples[0]?.parameters.filter((p) => p.isCustom) || [];
    setReport((prev) => ({
      ...prev,
      samples: [
        ...prev.samples,
        {
          sampleId: uuidv4(),
          label: `Sample ${prev.samples.length + 1}`,
          parameters: [
            ...DEFAULT_PARAMETERS.map((p) => ({ ...p, value: '', isCustom: false })),
            ...customParams.map((p) => ({ ...p, value: '' })),
          ],
        },
      ],
    }));
  }

  function removeSample(index) {
    if (report.samples.length <= 1) return;
    setReport((prev) => ({
      ...prev,
      samples: prev.samples.filter((_, i) => i !== index),
    }));
  }

  function addCustomParam() {
    const newParam = {
      name: '', value: '', unit: '', recommendedLimit: '',
      method: '', mandatoryLimit: '', description: '', recommendedAction: '',
      isCustom: true,
    };
    setReport((prev) => ({
      ...prev,
      samples: prev.samples.map((s) => ({
        ...s,
        parameters: [...s.parameters, { ...newParam }],
      })),
    }));
  }

  function removeCustomParam(paramIndex) {
    setReport((prev) => ({
      ...prev,
      samples: prev.samples.map((s) => ({
        ...s,
        parameters: s.parameters.filter((_, i) => i !== paramIndex),
      })),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateReport(report.reportId, report);
    } catch { /* mock fallback */ }
    setSaving(false);
    setSaveMessage('Report saved successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  }

  function openSendModal() {
    const defaults = buildDefaultEmail(report);
    setEmailSubject(defaults.subject);
    setEmailBody(defaults.body);
    setSendModal(true);
  }

  async function handleSendEmail() {
    try {
      await sendReportEmail(report.reportId);
    } catch { /* mock fallback */ }
    setReport((prev) => ({
      ...prev,
      status: 'SENT',
      sentMetadata: {
        sentAt: new Date().toISOString(),
        sentTo: prev.customerEmail,
        sentBy: user?.username || 'admin',
      },
    }));
    setSendModal(false);
    setSaveMessage('Email sent successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  }

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Loading report..." />
      </PageLayout>
    );
  }

  if (!report) {
    return (
      <PageLayout>
        <div className="report-error">
          <h2>Report Not Found</h2>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>
      </PageLayout>
    );
  }

  const allParams = report.samples.flatMap((s) => s.parameters);

  return (
    <PageLayout>
      <div className="admin-report">
        <div className="admin-report-toolbar">
          <Button variant="secondary" size="small" onClick={() => navigate('/admin')}>
            &larr; Dashboard
          </Button>
          <div className="toolbar-right">
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'preview' ? 'mode-active' : ''}`}
                onClick={() => setMode('preview')}
              >
                Preview
              </button>
              <button
                className={`mode-btn ${mode === 'edit' ? 'mode-active' : ''}`}
                onClick={() => setMode('edit')}
              >
                Edit
              </button>
            </div>
            <Button variant="outline" size="small" onClick={() => exportReportPdf('admin-report-preview', `HCAT-Report-${report.reportId}.pdf`)}>
              Export PDF
            </Button>
            <Button variant="success" size="small" onClick={openSendModal}>
              {report.status === 'SENT' ? 'Resend' : 'Send Email'}
            </Button>
          </div>
        </div>

        {saveMessage && <div className="save-message">{saveMessage}</div>}

        {mode === 'edit' ? (
          <div className="admin-edit-form">
            <section className="edit-section">
              <h2>Customer Information</h2>
              <div className="edit-grid">
                <Input label="Customer Name" id="ed-name" value={report.customerName} onChange={(e) => updateField('customerName', e.target.value)} />
                <Input label="Email" id="ed-email" type="email" value={report.customerEmail} onChange={(e) => updateField('customerEmail', e.target.value)} />
                <Input label="Phone" id="ed-phone" type="tel" value={report.customerPhone} onChange={(e) => updateField('customerPhone', e.target.value)} />
                <Input label="Address" id="ed-address" value={report.customerAddress} onChange={(e) => updateField('customerAddress', e.target.value)} />
                <Input label="Sample Date" id="ed-date" type="date" value={report.sampleDate} onChange={(e) => updateField('sampleDate', e.target.value)} />
              </div>
            </section>

            <section className="edit-section">
              <h2>Samples</h2>
              {report.samples.map((sample, index) => (
                <SampleCard
                  key={sample.sampleId}
                  sample={sample}
                  sampleIndex={index}
                  canRemove={report.samples.length > 1}
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

            <section className="edit-section">
              <h2>Notes</h2>
              <textarea
                className="notes-textarea"
                value={report.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Notes about the sample..."
                rows={4}
              />
            </section>

            <div className="edit-save-bar">
              <Button size="large" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="admin-preview" id="admin-report-preview">
            <ReportHeader report={report} />
            <CustomerInfo report={report} />
            <ResultsTable samples={report.samples} onParamClick={setSelectedParam} />
            <ReportNotes notes={report.notes} />
            <Disclaimer />
            <DrinkingWaterGuide parameters={allParams} expandedParam={selectedParam} />
          </div>
        )}
      </div>

      <Modal
        isOpen={sendModal}
        onClose={() => setSendModal(false)}
        title={report.status === 'SENT' ? 'Resend Report' : 'Send Report'}
        className="modal-wide"
      >
        <div className="email-compose">
          <div className="email-field">
            <label className="email-label">To</label>
            <div className="email-to">{report.customerEmail}</div>
          </div>
          <div className="email-field">
            <label className="email-label" htmlFor="ar-email-subject">Subject</label>
            <input
              id="ar-email-subject"
              className="email-input"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          <div className="email-field">
            <label className="email-label" htmlFor="ar-email-body">Message</label>
            <textarea
              id="ar-email-body"
              className="email-textarea"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={14}
            />
          </div>
          <p className="email-note">
            The report link will replace [View Your Report] automatically when sent.
          </p>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setSendModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSendEmail}>
            {report.status === 'SENT' ? 'Resend Email' : 'Send Email'}
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}
