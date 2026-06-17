import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="container">
        <span className="section-label">Rejoignez-nous</span>
        <h1 className="section-title">Contact</h1>
        <div className="divider" />
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Zone desservie</strong>
                <p>Ottawa & Gatineau</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <div>
                <strong>Téléphone / WhatsApp</strong>
                <p><a href="tel:3435587959">343 558-7959</a></p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉</span>
              <div>
                <strong>Courriel</strong>
                <p><a href="mailto:lelenembot@gmail.com">lelenembot@gmail.com</a></p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🕐</span>
              <div>
                <strong>Délai de réponse</strong>
                <p>Dans les 4 heures</p>
              </div>
            </div>
          </div>
          <div className="contact-cta-card">
            <h2>La façon la plus rapide ?</h2>
            <p>Soumettez directement votre demande avec des photos. Nous vous répondons dans les 4 heures.</p>
            <a href="/demande" className="btn-primary">Demander un ramassage</a>
          </div>
        </div>
      </div>
    </div>
  );
}
