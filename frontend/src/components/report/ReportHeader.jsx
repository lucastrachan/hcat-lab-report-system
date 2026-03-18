import { formatDate } from '../../utils/formatters';
import '../../styles/ReportHeader.css';

export default function ReportHeader({ report }) {
  return (
    <div className="report-header">
      <div className="report-meta">
        <div className="report-meta-item">
          <span className="meta-label">Sample Date</span>
          <span className="meta-value">{formatDate(report.sampleDate)}</span>
        </div>
        <div className="report-meta-item">
          <span className="meta-label">Report ID</span>
          <span className="meta-value meta-id">{report.reportId}</span>
        </div>
        {report.status === 'SENT' && report.sentMetadata?.sentAt && (
          <div className="report-meta-item">
            <span className="meta-label">Sent</span>
            <span className="meta-value">{formatDate(report.sentMetadata.sentAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
