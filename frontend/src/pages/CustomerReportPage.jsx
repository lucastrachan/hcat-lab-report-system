import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

export default function CustomerReportPage() {
  const { reportId } = useParams();

  return (
    <PageLayout>
      <div className="page-placeholder">
        <h1>Water Analysis Report</h1>
        <p>Customer-facing report for <code>{reportId}</code> will go here.</p>
      </div>
    </PageLayout>
  );
}
