import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';

export default function AdminReportPage() {
  const { reportId } = useParams();

  return (
    <PageLayout>
      <div className="page-placeholder">
        <h1>Edit Report</h1>
        <p>Report editor and preview for <code>{reportId}</code> will go here.</p>
      </div>
    </PageLayout>
  );
}
