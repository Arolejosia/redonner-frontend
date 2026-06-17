// About.jsx
import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <span className="section-label">Notre histoire</span>
          <h1 className="section-title">À propos de ReDonner</h1>
          <div className="divider" />
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              Chez ReDonner, nous croyons que de nombreux objets encore utiles sont jetés inutilement.
              Chaque année, des meubles, outils et articles de maison en bon état finissent aux ordures
              parce que leurs propriétaires n'ont pas de moyen simple de s'en débarrasser autrement.
            </p>
            <p>
              Notre mission est simple : faciliter la récupération de ces objets pour leur donner une
              seconde vie, plutôt que de les envoyer à l'enfouissement.
            </p>
            <p>
              <strong>ReDonner est une entreprise privée</strong> de récupération et de réemploi basée
              à Ottawa, Ontario. Les objets acceptés sont cédés gratuitement lors du ramassage.
            </p>
          </div>
          <div className="about-values">
            {[
              { icon: '♻', title: 'Réemploi', desc: 'Chaque objet récupéré est une victoire contre le gaspillage.' },
              { icon: '🤝', title: 'Service', desc: "Nous venons chercher l'objet chez vous — pas besoin de déplacement." },
              { icon: '🌱', title: 'Impact', desc: "Réduire l'enfouissement, un objet à la fois." },
            ].map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
