import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <p>&copy; {new Date().getFullYear()} High Country Aqua Tech. All rights reserved.</p>
      </div>
    </footer>
  );
}
