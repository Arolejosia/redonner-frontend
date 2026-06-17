import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Request.css';

const OBJECT_TYPES = [
  'Meuble (table, chaise, bureau, étagère)',
  'Électroménager',
  'Outil',
  'Article de maison',
  'Article pour enfants',
  'Autre',
];

const CONDITIONS = ['Excellent', 'Bon', 'Acceptable'];
const PERIODES   = ['Matin (8h–12h)', 'Après-midi (12h–17h)', 'Soir (17h–20h)'];

export default function Request() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [form, setForm] = useState({
    nom: '', telephone: '', courriel: '',
    adresse: '', ville: '',
    typeObjet: '', description: '', etat: '', dimensions: '',
    depotExterieur: '', // 'oui' | 'non'
  });

  // 3 disponibilités (seulement si depotExterieur === 'non')
  const [dispos, setDispos] = useState([
    { date: '', periode: '' },
    { date: '', periode: '' },
    { date: '', periode: '' },
  ]);

  const [photos,     setPhotos]     = useState([]);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setDispo = (idx, field, value) =>
    setDispos((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d));

  // ── Photos ──────────────────────────────────────────────────────────────────
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) { alert('Maximum 10 photos.'); return; }
    setPhotos((prev) => [
      ...prev,
      ...files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    ]);
  };
  const removePhoto = (idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.nom.trim())            e.nom        = 'Requis';
    if (!form.telephone.trim())      e.telephone  = 'Requis';
    if (!form.courriel.includes('@')) e.courriel  = 'Courriel invalide';
    if (!form.adresse.trim())        e.adresse    = 'Requis';
    if (!form.ville.trim())          e.ville      = 'Requis';
    if (!form.typeObjet)             e.typeObjet  = 'Requis';
    if (!form.description.trim())    e.description= 'Requis';
    if (!form.etat)                  e.etat       = 'Requis';
    if (!form.depotExterieur)        e.depotExterieur = 'Choisissez une option';
    if (photos.length < 1)           e.photos     = 'Ajoutez au moins 1 photo';

    // Si rendez-vous nécessaire → au moins 1 dispo complète
    if (form.depotExterieur === 'non') {
      const valides = dispos.filter((d) => d.date && d.periode);
      if (valides.length === 0) e.dispos = 'Ajoutez au moins une disponibilité';
    }
    return e;
  };

  // ── Soumission ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('disponibilites', JSON.stringify(
        dispos.filter((d) => d.date && d.periode)
      ));
      photos.forEach((p) => fd.append('photos', p.file));

      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/requests`, {
        method: 'POST', body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur.');
      navigate('/confirmation');
    } catch (err) {
      setErrors({ global: err.message || 'Une erreur est survenue. Réessayez.' });
      setSubmitting(false);
    }
  };

  const depotOui = form.depotExterieur === 'oui';
  const depotNon = form.depotExterieur === 'non';

  return (
    <div className="request-page">
      <div className="container">

        <div className="request-header">
          <span className="section-label">Formulaire</span>
          <h1 className="section-title">Demander un ramassage</h1>
          <div className="divider" />
          <p className="request-intro">
            Remplissez ce formulaire en une seule fois. Nous vous confirmons
            par courriel si votre objet est admissible — aucun appel nécessaire.
          </p>
        </div>

        {errors.global && <div className="global-error">{errors.global}</div>}

        <div className="request-layout">
          <div className="request-form">

            {/* ── 1. Coordonnées ── */}
            <fieldset className="form-section">
              <legend><span className="legend-num">1</span> Vos coordonnées</legend>

              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input type="text" value={form.nom} onChange={set('nom')}
                    placeholder="Jean Tremblay" />
                  {errors.nom && <span className="field-error">{errors.nom}</span>}
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input type="tel" value={form.telephone} onChange={set('telephone')}
                    placeholder="613-555-1234" />
                  {errors.telephone && <span className="field-error">{errors.telephone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Courriel *</label>
                <input type="email" value={form.courriel} onChange={set('courriel')}
                  placeholder="jean@exemple.com" />
                {errors.courriel && <span className="field-error">{errors.courriel}</span>}
              </div>
            </fieldset>

            {/* ── 2. Adresse de ramassage ── */}
            <fieldset className="form-section">
              <legend><span className="legend-num">2</span> Adresse de ramassage</legend>

              <div className="form-group">
                <label>Adresse complète *</label>
                <input type="text" value={form.adresse} onChange={set('adresse')}
                  placeholder="123 rue Principale, App. 4" />
                {errors.adresse && <span className="field-error">{errors.adresse}</span>}
              </div>
              <div className="form-group">
                <label>Ville *</label>
                <input type="text" value={form.ville} onChange={set('ville')}
                  placeholder="Ottawa, Gatineau…" />
                {errors.ville && <span className="field-error">{errors.ville}</span>}
              </div>
            </fieldset>

            {/* ── 3. L'objet ── */}
            <fieldset className="form-section">
              <legend><span className="legend-num">3</span> L'objet</legend>

              <div className="form-group">
                <label>Type d'objet *</label>
                <select value={form.typeObjet} onChange={set('typeObjet')}>
                  <option value="">— Choisissez —</option>
                  {OBJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.typeObjet && <span className="field-error">{errors.typeObjet}</span>}
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea value={form.description} onChange={set('description')} rows={3}
                  placeholder="Ex : Table en bois 4 personnes, légèrement rayée sur le dessus…" />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>État général *</label>
                  <div className="radio-group">
                    {CONDITIONS.map((c) => (
                      <label key={c} className={`radio-pill ${form.etat === c ? 'selected' : ''}`}>
                        <input type="radio" name="etat" value={c}
                          checked={form.etat === c} onChange={set('etat')} />
                        {c}
                      </label>
                    ))}
                  </div>
                  {errors.etat && <span className="field-error">{errors.etat}</span>}
                </div>
                <div className="form-group">
                  <label>Dimensions approximatives</label>
                  <input type="text" value={form.dimensions} onChange={set('dimensions')}
                    placeholder="Ex : 150 × 80 × 75 cm" />
                </div>
              </div>
            </fieldset>

            {/* ── 4. Mode de récupération ── */}
            <fieldset className="form-section">
              <legend><span className="legend-num">4</span> Mode de récupération</legend>
              <p className="section-hint">
                Certains objets peuvent être déposés à l'extérieur — pas besoin de rendez-vous.
              </p>

              <div className="depot-choice">
                <label className={`depot-card ${depotOui ? 'selected' : ''}`}>
                  <input type="radio" name="depot" value="oui"
                    checked={depotOui} onChange={set('depotExterieur')} />
                  <span className="depot-icon">🌿</span>
                  <strong>Dépôt extérieur</strong>
                  <span>Je mets l'objet dehors — vous venez le chercher quand vous voulez</span>
                </label>

                <label className={`depot-card ${depotNon ? 'selected' : ''}`}>
                  <input type="radio" name="depot" value="non"
                    checked={depotNon} onChange={set('depotExterieur')} />
                  <span className="depot-icon">🏠</span>
                  <strong>Quelqu'un doit être présent</strong>
                  <span>Je propose mes disponibilités — vous confirmez une date</span>
                </label>
              </div>
              {errors.depotExterieur && <span className="field-error">{errors.depotExterieur}</span>}

              {/* Disponibilités — seulement si rendez-vous */}
              {depotNon && (
                <div className="dispos-section">
                  <p className="dispos-hint">
                    Proposez jusqu'à 3 créneaux. Nous confirmerons celui qui nous convient.
                  </p>
                  {dispos.map((d, i) => (
                    <div key={i} className="dispo-row">
                      <span className="dispo-num">{i + 1}</span>
                      <input type="date" value={d.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDispo(i, 'date', e.target.value)} />
                      <select value={d.periode}
                        onChange={(e) => setDispo(i, 'periode', e.target.value)}>
                        <option value="">— Période —</option>
                        {PERIODES.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  ))}
                  {errors.dispos && <span className="field-error">{errors.dispos}</span>}
                </div>
              )}
            </fieldset>

            {/* ── 5. Photos ── */}
            <fieldset className="form-section">
              <legend><span className="legend-num">5</span> Photos de l'objet</legend>
              <p className="photos-hint">Minimum 1 photo, maximum 10.</p>

              <div className="photo-drop"
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handlePhotos({ target: { files: e.dataTransfer.files } }); }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 6v16M10 14l8-8 8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 28h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Appuyez pour ajouter des photos</span>
                <span className="photo-count">{photos.length}/10 photo{photos.length !== 1 ? 's' : ''}</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple
                style={{ display: 'none' }} onChange={handlePhotos} />
              {errors.photos && <span className="field-error">{errors.photos}</span>}

              {photos.length > 0 && (
                <div className="photo-preview-grid">
                  {photos.map((p, i) => (
                    <div key={i} className="photo-thumb">
                      <img src={p.url} alt={`Photo ${i + 1}`} />
                      <button className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            {/* ── Soumettre ── */}
            <div className="form-submit">
              <p className="legal-note">
                ReDonner est une entreprise privée de récupération et de réemploi.
                Les objets acceptés sont cédés gratuitement lors du ramassage.
              </p>
              <button className="btn-primary submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Envoi en cours…' : 'Envoyer ma demande →'}
              </button>
            </div>

          </div>

          {/* ── Sidebar ── */}
          <aside className="request-sidebar">
            <div className="sidebar-card">
              <h3>Ce qui se passe ensuite</h3>
              <ol>
                <li>Nous analysons votre demande et vos photos.</li>
                <li>
                  Si admissible :<br/>
                  <strong>Dépôt extérieur</strong> → on vient dans les 48h.<br/>
                  <strong>Rendez-vous</strong> → on confirme un de vos créneaux par courriel.
                </li>
                <li>Si refusé → vous recevez un courriel d'explication.</li>
              </ol>
            </div>
            <div className="sidebar-card sidebar-accepted">
              <h3>✓ Généralement acceptés</h3>
              <ul>
                <li>Tables, chaises, bureaux</li>
                <li>Étagères et armoires</li>
                <li>Outils en bon état</li>
                <li>Articles pour enfants</li>
                <li>Articles de maison réutilisables</li>
              </ul>
            </div>
            <div className="sidebar-card sidebar-refused">
              <h3>✗ Non acceptés</h3>
              <ul>
                <li>Matelas</li>
                <li>Objets cassés ou endommagés</li>
                <li>Déchets ou matériaux de construction</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
