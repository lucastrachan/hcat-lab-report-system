import { DISCLAIMER_TEXT } from '../../constants/disclaimer';
import '../../styles/Disclaimer.css';

export default function Disclaimer() {
  return (
    <div className="disclaimer">
      <h2 className="section-title">Disclaimer</h2>
      <p className="disclaimer-text">{DISCLAIMER_TEXT}</p>
    </div>
  );
}
