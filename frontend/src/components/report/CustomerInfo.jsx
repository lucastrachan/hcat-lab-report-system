import '../../styles/CustomerInfo.css';

export default function CustomerInfo({ report }) {
  return (
    <div className="customer-info">
      <h2 className="section-title">Customer Information</h2>
      <div className="customer-grid">
        <div className="customer-field">
          <span className="field-label">Name</span>
          <span className="field-value">{report.customerName}</span>
        </div>
        {report.customerEmail && (
          <div className="customer-field">
            <span className="field-label">Email</span>
            <span className="field-value">{report.customerEmail}</span>
          </div>
        )}
        {report.customerPhone && (
          <div className="customer-field">
            <span className="field-label">Phone</span>
            <span className="field-value">{report.customerPhone}</span>
          </div>
        )}
        {report.customerAddress && (
          <div className="customer-field">
            <span className="field-label">Address</span>
            <span className="field-value">{report.customerAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
}
