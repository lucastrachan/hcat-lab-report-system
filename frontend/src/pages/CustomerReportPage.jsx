import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ReportHeader from '../components/report/ReportHeader';
import CustomerInfo from '../components/report/CustomerInfo';
import ResultsTable from '../components/report/ResultsTable';
import ReportNotes from '../components/report/ReportNotes';
import Disclaimer from '../components/report/Disclaimer';
import DrinkingWaterGuide from '../components/report/DrinkingWaterGuide';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import { getReport } from '../api/reportApi';
import { exportReportPdf } from '../utils/pdfExport';
import MOCK_REPORT from '../constants/mockReport';
import '../styles/CustomerReportPage.css';

export default function CustomerReportPage() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      setError(null);
      try {
        const data = await getReport(reportId);
        setReport(data);
      } catch {
        // Fallback to mock data for development
        setReport(MOCK_REPORT);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Loading report..." />
      </PageLayout>
    );
  }

  if (error && !report) {
    return (
      <PageLayout>
        <div className="report-error">
          <h2>Report Not Found</h2>
          <p>The report you are looking for could not be loaded.</p>
        </div>
      </PageLayout>
    );
  }

  if (!report) return null;

  const allParams = report.samples.flatMap((s) => s.parameters);

  return (
    <PageLayout>
      <div className="customer-report" id="report-content">
        <ReportHeader report={report} />
        <CustomerInfo report={report} />
        <ResultsTable samples={report.samples} />
        <ReportNotes notes={report.notes} />
        <Disclaimer />

        <div className="report-export">
          <Button
            variant="outline"
            onClick={() => exportReportPdf('report-content', `HCAT-Report-${report.reportId}.pdf`)}
          >
            Export as PDF
          </Button>
        </div>

        <DrinkingWaterGuide parameters={allParams} />
      </div>
    </PageLayout>
  );
}
