import { useState, useEffect, useCallback } from 'react';
import './Admin.css';

const API = import.meta.env.VITE_API_URL;

const STATUS_LABELS = {
  en_attente: { label: 'En attente', color: '#e6a817' },
  accepte:    { label: 'Accepté',    color: '#2D5016' },
  refuse:     { label: 'Refusé',     color: '#c0392b' },
};

export default function Admin() {
  const [authed, setAuthed]       = useState(false);
  const [token,  setToken]        = useState('');
  const [pw,     setPw]           = useState('');
  const [pwError,setPwError]      = useState('');
  const [requests,setRequests]    = useState([]);
  const [loading, setLoading]     = useState(false);
  const [apiError,setApiError]    = useState('');
  const [selected,setSelected]    = useState(null);
  const [filterStatus,setFilterStatus] = useState('tous');
  const [creneau, setCreneau]     = useState(''); // créneau choisi par admin

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async () => {
    setPwError('');
    try {
      const res  = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error || 'Mot de passe incorrect.'); return; }
      setToken(data.token);
      setAuthed(true);
    } catch {
      setPwError('Impossible de joindre le serveur.');
    }
  };

  // ── Charger les demandes ──────────────────────────────────────────────────
  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true); setApiError('');
    try {
      const url = filterStatus === 'tous'
        ? `${API}/api/requests`
        : `${API}/api/requests?statut=${filterStatus}`;
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequests(data.data.map((r) => ({
        ...r,
        id:   r._id,
        date: new Date(r.createdAt).toLocaleDateString('fr-CA'),
      })));
    } catch (err) {
      setApiError(err.message || 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => { if (authed) fetchRequests(); }, [authed, fetchRequests]);

  // ── Sélectionner une demande ───────────────────────────────────────────────
  const selectRequest = (r) => {
    setSelected(r);
    setCreneau(r.creneauConfirme || '');
  };

  // ── Mettre à jour statut ──────────────────────────────────────────────────
  const updateStatus = async (id, statut) => {
    // Si rendez-vous + acceptation → le créneau est obligatoire
    if (statut === 'accepte' && selected?.depotExterieur === 'non' && !creneau) {
      alert('Veuillez choisir un créneau avant d\'accepter.');
      return;
    }
    try {
      const res  = await fetch(`${API}/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statut, creneauConfirme: creneau }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, statut, creneauConfirme: creneau } : r));
      setSelected((prev) => ({ ...prev, statut, creneauConfirme: creneau }));
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  const filtered = requests.filter(
    (r) => filterStatus === 'tous' || r.statut === filterStatus
  );

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="admin-login">
      <div className="login-card">
        <h1>Admin ReDonner</h1>
        <p>Accès réservé</p>
        <input type="password" placeholder="Mot de passe" value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()} />
        {pwError && <span className="field-error">{pwError}</span>}
        <button className="btn-primary" onClick={login}>Se connecter</button>
      </div>
    </div>
  );

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header-inner">
          <h1>Tableau de bord — ReDonner</h1>
          <div className="admin-stats">
            <div className="stat"><span>{requests.filter(r => r.statut === 'en_attente').length}</span>En attente</div>
            <div className="stat"><span>{requests.filter(r => r.statut === 'accepte').length}</span>Acceptées</div>
            <div className="stat"><span>{requests.filter(r => r.statut === 'refuse').length}</span>Refusées</div>
          </div>
        </div>
      </div>

      <div className="container admin-body">
        {apiError && (
          <div className="admin-banner error">
            {apiError} <button onClick={fetchRequests}>Réessayer</button>
          </div>
        )}

        {/* Filtres */}
        <div className="admin-filters">
          {['tous', 'en_attente', 'accepte', 'refuse'].map((s) => (
            <button key={s}
              className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}>
              {s === 'tous' ? 'Toutes' : STATUS_LABELS[s].label}
            </button>
          ))}
          <button className="filter-btn refresh-btn" onClick={fetchRequests}>↻ Actualiser</button>
        </div>

        <div className="admin-layout">
          {/* Tableau */}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Objet</th>
                  <th>Ville</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="td-empty">Chargement…</td></tr>
                )}
                {!loading && filtered.map((r) => {
                  const s = STATUS_LABELS[r.statut];
                  return (
                    <tr key={r.id}
                      className={selected?.id === r.id ? 'row-selected' : ''}
                      onClick={() => selectRequest(r)}>
                      <td className="td-nom">{r.nom}</td>
                      <td>{r.typeObjet}</td>
                      <td>{r.ville}</td>
                      <td>{r.depotExterieur === 'oui' ? '🌿 Extérieur' : '🏠 RDV'}</td>
                      <td>{r.date}</td>
                      <td>
                        <span className="status-badge"
                          style={{ background: s.color + '22', color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="td-empty">Aucune demande.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Panneau détail */}
          {selected && (
            <div className="admin-detail">
              <div className="detail-header">
                <div>
                  <h2>{selected.typeObjet}</h2>
                  <span className="detail-mode">
                    {selected.depotExterieur === 'oui' ? '🌿 Dépôt extérieur' : '🏠 Rendez-vous requis'}
                  </span>
                </div>
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="detail-info">
                <div><label>Nom</label><span>{selected.nom}</span></div>
                <div><label>Téléphone</label><a href={`tel:${selected.telephone}`}>{selected.telephone}</a></div>
                <div><label>Courriel</label><a href={`mailto:${selected.courriel}`}>{selected.courriel}</a></div>
                <div><label>Adresse</label><span>{selected.adresse}</span></div>
                <div><label>Ville</label><span>{selected.ville}</span></div>
                <div><label>État</label><span>{selected.etat}</span></div>
                {selected.dimensions && <div><label>Dimensions</label><span>{selected.dimensions}</span></div>}
                <div><label>Date</label><span>{selected.date}</span></div>
                <div><label>Statut</label>
                  <span className="status-badge" style={{
                    background: STATUS_LABELS[selected.statut].color + '22',
                    color: STATUS_LABELS[selected.statut].color,
                  }}>
                    {STATUS_LABELS[selected.statut].label}
                  </span>
                </div>
              </div>

              {/* Description */}
              {selected.description && (
                <div className="detail-description">
                  <label>Description</label>
                  <p>{selected.description}</p>
                </div>
              )}

              {/* Disponibilités (si rendez-vous) */}
              {selected.depotExterieur === 'non' && selected.disponibilites?.length > 0 && (
                <div className="detail-dispos">
                  <label>Disponibilités proposées</label>
                  <div className="dispos-list">
                    {selected.disponibilites.map((d, i) => (
                      <button key={i}
                        className={`dispo-btn ${creneau === `${d.date} — ${d.periode}` ? 'selected' : ''}`}
                        onClick={() => setCreneau(`${d.date} — ${d.periode}`)}>
                        📅 {d.date} · {d.periode}
                      </button>
                    ))}
                  </div>
                  {creneau && (
                    <p className="creneau-choisi">✓ Créneau choisi : <strong>{creneau}</strong></p>
                  )}
                </div>
              )}

              {/* Photos */}
              {selected.photos && selected.photos.length > 0 && (
                <div className="detail-photos">
                  <label>{selected.photos.length} photo{selected.photos.length > 1 ? 's' : ''}</label>
                  <div className="detail-photos-grid">
                    {selected.photos.map((p, i) => (
                      <a key={i} href={p.url} target="_blank" rel="noreferrer">
                        <img src={p.url} alt={`Photo ${i + 1}`} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="detail-actions">
                <button className="action-btn accept"
                  disabled={selected.statut === 'accepte'}
                  onClick={() => updateStatus(selected.id, 'accepte')}>
                  ✓ Accepter {selected.depotExterieur === 'non' && creneau ? `(${creneau.split(' — ')[0]})` : ''}
                </button>
                <button className="action-btn refuse"
                  disabled={selected.statut === 'refuse'}
                  onClick={() => updateStatus(selected.id, 'refuse')}>
                  ✕ Refuser
                </button>
                <a href={`tel:${selected.telephone}`} className="action-btn contact">📞 Appeler</a>
                <a href={`mailto:${selected.courriel}`} className="action-btn contact">✉ Courriel</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
