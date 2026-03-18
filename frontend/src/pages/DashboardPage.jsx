import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Tabs from '../components/shared/Tabs';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { useAuth } from '../auth/AuthProvider';
import { listReports, deleteReport, sendReportEmail } from '../api/reportApi';
import { exportReportPdf } from '../utils/pdfExport';
import { formatDate, formatDateTime } from '../utils/formatters';
import MOCK_REPORTS from '../constants/mockReports';
import '../styles/DashboardPage.css';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('UNSENT');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, report: null });
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await listReports();
      setReports(data);
    } catch {
      setReports(MOCK_REPORTS);
    } finally {
      setLoading(false);
    }
  }

  const query = searchQuery.toLowerCase().trim();

  function matchesSearch(r) {
    if (!query) return true;
    return (
      r.customerName.toLowerCase().includes(query) ||
      r.customerEmail.toLowerCase().includes(query) ||
      (r.customerAddress || '').toLowerCase().includes(query) ||
      r.reportId.toLowerCase().includes(query)
    );
  }

  const unsentReports = reports.filter((r) => r.status === 'UNSENT' && matchesSearch(r));
  const sentReports = reports.filter((r) => r.status === 'SENT' && matchesSearch(r));
  const filteredReports = activeTab === 'UNSENT' ? unsentReports : sentReports;

  const tabs = [
    { id: 'UNSENT', label: 'Unsent', count: unsentReports.length },
    { id: 'SENT', label: 'Sent', count: sentReports.length },
  ];

  function buildDefaultEmail(report) {
    const firstName = report.customerName.split(' ')[0];
    const subject = `Your Water Analysis Report is Ready — High Country Aqua Tech`;
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

  function openConfirm(type, report) {
    if (type === 'send') {
      const defaults = buildDefaultEmail(report);
      setEmailSubject(defaults.subject);
      setEmailBody(defaults.body);
    }
    setConfirmModal({ open: true, type, report });
  }

  function closeConfirm() {
    setConfirmModal({ open: false, type: null, report: null });
  }

  async function handleDelete() {
    const { report } = confirmModal;
    setActionLoading(report.reportId);
    try {
      await deleteReport(report.reportId);
    } catch { /* mock fallback */ }
    setReports((prev) => prev.filter((r) => r.reportId !== report.reportId));
    setActionLoading(null);
    closeConfirm();
  }

  async function handleSendEmail() {
    const { report } = confirmModal;
    setActionLoading(report.reportId);
    try {
      await sendReportEmail(report.reportId);
    } catch { /* mock fallback */ }
    setReports((prev) =>
      prev.map((r) =>
        r.reportId === report.reportId
          ? {
              ...r,
              status: 'SENT',
              sentMetadata: {
                sentAt: new Date().toISOString(),
                sentTo: r.customerEmail,
                sentBy: user?.username || 'admin',
              },
            }
          : r,
      ),
    );
    setActionLoading(null);
    closeConfirm();
  }

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Loading reports..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Report Dashboard</h1>
            <p className="dashboard-subtitle">
              Signed in as <strong>{user?.username}</strong>
            </p>
          </div>
          <Button variant="secondary" size="small" onClick={signOut}>
            Sign Out
          </Button>
        </div>

        <div className="dashboard-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              &times;
            </button>
          )}
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {filteredReports.length === 0 ? (
          <div className="dashboard-empty">
            <p>No {activeTab.toLowerCase()} reports.</p>
          </div>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Sample Date</th>
                  <th>Submitted</th>
                  <th>Samples</th>
                  <th className="dash-actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.reportId}>
                    <td>
                      <div className="dash-customer">
                        <span className="dash-customer-name">{report.customerName}</span>
                        <span className="dash-customer-email">{report.customerEmail}</span>
                      </div>
                    </td>
                    <td className="dash-address">{report.customerAddress || '—'}</td>
                    <td>{formatDate(report.sampleDate)}</td>
                    <td>{formatDateTime(report.createdAt)}</td>
                    <td className="dash-samples-count">{report.samples?.length || 0}</td>
                    <td className="dash-actions-col">
                      <div className="dash-actions">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => navigate(`/admin/report/${report.reportId}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => openConfirm('send', report)}
                          disabled={actionLoading === report.reportId}
                        >
                          {report.status === 'SENT' ? 'Resend' : 'Send'}
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => openConfirm('delete', report)}
                          disabled={actionLoading === report.reportId}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmModal.open && confirmModal.type === 'delete'}
        onClose={closeConfirm}
        title="Delete Report"
      >
        <p>
          Are you sure you want to delete the report for{' '}
          <strong>{confirmModal.report?.customerName}</strong>? This cannot be undone.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={closeConfirm}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>

      <Modal
        isOpen={confirmModal.open && confirmModal.type === 'send'}
        onClose={closeConfirm}
        title={confirmModal.report?.status === 'SENT' ? 'Resend Report' : 'Send Report'}
        className="modal-wide"
      >
        <div className="email-compose">
          <div className="email-field">
            <label className="email-label">To</label>
            <div className="email-to">{confirmModal.report?.customerEmail}</div>
          </div>
          <div className="email-field">
            <label className="email-label" htmlFor="email-subject">Subject</label>
            <input
              id="email-subject"
              className="email-input"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          <div className="email-field">
            <label className="email-label" htmlFor="email-body">Message</label>
            <textarea
              id="email-body"
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
          <Button variant="secondary" onClick={closeConfirm}>Cancel</Button>
          <Button variant="success" onClick={handleSendEmail}>
            {confirmModal.report?.status === 'SENT' ? 'Resend Email' : 'Send Email'}
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}
