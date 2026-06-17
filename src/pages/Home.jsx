import { Link } from 'react-router-dom';
import './Home.css';

const steps = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="10" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="28" cy="13" r="2.5" fill="currentColor"/>
      </svg>
    ),
    label: 'Photographiez',
    desc: "Prenez quelques photos de l'objet sous différents angles.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12h20M10 20h14M10 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="30" cy="28" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M27.5 28l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Soumettez',
    desc: 'Remplissez le formulaire en ligne en quelques minutes.',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 14v6l4 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Nous analysons',
    desc: "Nous vérifions si l'objet est admissible au ramassage.",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="18" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 18v-4a4 4 0 014-4h12a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="13" cy="32" r="2.5" fill="currentColor"/>
        <circle cx="27" cy="32" r="2.5" fill="currentColor"/>
      </svg>
    ),
    label: 'Ramassage',
    desc: "Si accepté, nous organisons le ramassage à votre domicile.",
  },
];

const accepted = ['Tables', 'Chaises', 'Bureaux', 'Étagères', 'Outils', 'Articles de maison', 'Articles pour enfants'];
const refused = ['Matelas', 'Objets cassés', 'Articles fortement endommagés', 'Déchets ou matériaux de construction'];

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="section-label">Ottawa & Gatineau</span>
            <h1 className="hero-title">
              Donnez une{' '}
              <em>seconde vie</em>{' '}
              à vos objets.
            </h1>
            <p className="hero-sub">
              Vous avez un meuble ou un objet en bon état dont vous ne voulez plus ?
              Soumettez quelques photos — nous nous occupons du reste.
            </p>
            <div className="hero-actions">
              <Link to="/demande" className="btn-primary">Demander un ramassage</Link>
              <Link to="/a-propos" className="btn-outline">Notre mission</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-placeholder">
              <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="320" height="280" rx="16" fill="#E8E2D9"/>
                {/* Chair sketch */}
                <rect x="100" y="80" width="120" height="80" rx="8" fill="#C5BAA8" stroke="#8B7355" strokeWidth="2"/>
                <rect x="110" y="160" width="12" height="60" rx="4" fill="#8B7355"/>
                <rect x="198" y="160" width="12" height="60" rx="4" fill="#8B7355"/>
                <rect x="100" y="170" width="120" height="10" rx="4" fill="#A08060"/>
                {/* Plant */}
                <rect x="230" y="190" width="18" height="30" rx="4" fill="#7A6045"/>
                <ellipse cx="239" cy="190" rx="22" ry="28" fill="#4A7C2F"/>
                <ellipse cx="228" cy="178" rx="14" ry="18" fill="#3D6B1E"/>
                <ellipse cx="250" cy="182" rx="12" ry="16" fill="#5A9A35"/>
                {/* Arrow / recycle hint */}
                <path d="M60 140 Q80 110 100 130" stroke="#2D5016" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="6 4"/>
                <text x="48" y="165" fontFamily="serif" fontSize="12" fill="#2D5016" fontStyle="italic">Seconde vie</text>
              </svg>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">♻</span>
              <span>Zéro gaspillage</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="steps-section">
        <div className="container">
          <span className="section-label" style={{ textAlign: 'center', display: 'block' }}>Processus simple</span>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Comment ça fonctionne ?</h2>
          <div className="divider" style={{ margin: '16px auto 40px' }} />
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-label">{s.label}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="mission-section">
        <div className="container mission-inner">
          <div className="mission-text">
            <span className="section-label">Notre engagement</span>
            <h2 className="section-title">Réduisons le gaspillage,<br />un objet à la fois.</h2>
            <div className="divider" />
            <p>
              Chez ReDonner, nous croyons que de nombreux objets encore utiles
              sont jetés inutilement. Notre mission est de faciliter leur récupération
              afin qu'ils puissent continuer à servir plutôt que d'être envoyés à l'enfouissement.
            </p>
            <p style={{ marginTop: 16 }}>
              Nous sommes une entreprise privée de récupération et de réemploi basée à Ottawa.
              Les objets acceptés sont cédés gratuitement lors du ramassage.
            </p>
          </div>
          <div className="mission-items">
            <div className="items-card">
              <h3 className="items-title accepted-title">
                <span className="items-icon">✓</span> Généralement acceptés
              </h3>
              <ul>
                {accepted.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="items-card refused-card">
              <h3 className="items-title refused-title">
                <span className="items-icon">✗</span> Non acceptés
              </h3>
              <ul>
                {refused.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
            Prêt à vous départir<br />d'un objet ?
          </h2>
          <p>C'est gratuit, rapide et sans déplacement de votre part.</p>
          <Link to="/demande" className="btn-primary" style={{ background: 'var(--color-white)', color: 'var(--color-forest)' }}>
            Faire une demande maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}
