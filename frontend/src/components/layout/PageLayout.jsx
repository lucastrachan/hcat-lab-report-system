import '../../styles/PageLayout.css';

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <main className="page-content">{children}</main>
    </div>
  );
}
