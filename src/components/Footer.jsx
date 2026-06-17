import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-re">Re</span>Donner
          </Link>
          <p>Une seconde vie pour vos objets.</p>
          <p className="footer-legal">
            Entreprise privée de récupération et de réemploi.<br />
            Ottawa, Ontario, Canada.
          </p>
        </div>
        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/demande">Faire une demande</Link></li>
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p><a href="tel:3435587959">343 558-7959</a></p>
          <p><a href="mailto:lelenembot@gmail.com">lelenembot@gmail.com</a></p>
          <p>Ottawa & Gatineau</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} ReDonner. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
