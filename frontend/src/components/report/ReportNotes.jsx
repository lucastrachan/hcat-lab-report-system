import '../../styles/ReportNotes.css';

export default function ReportNotes({ notes }) {
  if (!notes || notes.trim() === '') return null;

  return (
    <div className="report-notes">
      <h2 className="section-title">Notes</h2>
      <p className="notes-text">{notes}</p>
    </div>
  );
}
