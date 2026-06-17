import { Link } from 'react-router-dom';
import './Confirmation.css';

export default function Confirmation() {
  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <h1>Demande envoyée !</h1>
        <p>
          Nous avons bien reçu votre demande. Vous recevrez une réponse
          par courriel ou par téléphone dans les <strong>48 heures</strong>.
        </p>
        <p className="confirm-note">
          Si votre objet est admissible, nous vous contacterons pour organiser le ramassage.
        </p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
