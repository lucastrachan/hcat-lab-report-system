import Header from './Header';
import Footer from './Footer';
import '../../styles/PageLayout.css';

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <Header />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}
