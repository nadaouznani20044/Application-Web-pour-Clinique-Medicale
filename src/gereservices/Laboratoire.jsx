import { useState } from "react";
import "../styles/Laboratoire.css";

const analysesData = [];

const medecins    = ["Tous les médecins", "Dr. A. Fournier", "Dr. J. Chen", "Dr. M. Blanc"];
const categories  = ["Toutes les catégories", "Sang", "Biochimie", "Microbiologie", "Hormonal"];
const statuts     = ["Tous les statuts", "en-attente", "en-cours", "resultat-pret", "envoye", "urgent"];

const statutLabels = {
  "en-attente":    { label: "En attente",     color: "#b45309", bg: "#fffbeb" },
  "en-cours":      { label: "En cours",       color: "#0369a1", bg: "#f0f9ff" },
  "resultat-pret": { label: "Résultat prêt",  color: "#059669", bg: "#ecfdf5" },
  "envoye":        { label: "Envoyé médecin", color: "#7c3aed", bg: "#faf5ff" },
  "urgent":        { label: "Urgent",         color: "#dc2626", bg: "#fef2f2" },
};

const categorieConfig = {
  "Sang":          { icon: "🩸", color: "#dc2626", bg: "#fef2f2" },
  "Biochimie":     { icon: "🧪", color: "#0369a1", bg: "#f0f9ff" },
  "Microbiologie": { icon: "🦠", color: "#059669", bg: "#ecfdf5" },
  "Hormonal":      { icon: "⚗️",  color: "#7c3aed", bg: "#faf5ff" },
};

const typesAnalyse = {
  "Sang":          ["FNS (Formule Numérique Sanguine)", "Fer & Ferritine", "Glycémie", "Groupe Sanguin", "Coagulation"],
  "Biochimie":     ["Bilan hépatique", "Bilan rénal", "Électrolytes", "Lipides", "Protéines"],
  "Microbiologie": ["Hémoculture", "ECBU", "Coproculture", "Antibiogramme", "PCR"],
  "Hormonal":      ["TSH / T4", "Cortisol", "Testostérone", "Œstrogènes", "Insuline"],
};

const avatarColors = [
  "#b91c1c", "#c2410c", "#047857", "#0369a1",
  "#6d28d9", "#0e7490", "#1d4ed8", "#7e22ce",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Laboratoire() {
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedMedecin, setSelectedMedecin] = useState("Tous les médecins");
  const [selectedDate,    setSelectedDate]    = useState("");
  const [selectedCat,     setSelectedCat]     = useState("Toutes les catégories");
  const [selectedStatut,  setSelectedStatut]  = useState("Tous les statuts");
  const [showModal,       setShowModal]       = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);
  const [activeTab,       setActiveTab]       = useState("Sang");

  const filtered = analysesData.filter((a) => {
    const matchSearch  = a.nom.toLowerCase().includes(searchQuery.toLowerCase()) || a.typeAnalyse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les médecins"        || a.medecin   === selectedMedecin;
    const matchCat     = selectedCat     === "Toutes les catégories"    || a.categorie === selectedCat;
    const matchStatut  = selectedStatut  === "Tous les statuts"         || a.statut    === selectedStatut;
    return matchSearch && matchMedecin && matchCat && matchStatut;
  });

  const openModal  = (a) => { setSelectedAnalyse(a); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  const countBy = (key, val) => analysesData.filter(a => a[key] === val).length;

  return (
    <>
      <div className="lab-wrapper">

        
        <div className="lab-header">
          <div>
            <h1 className="lab-title">
              Gestion des Analyses : <span>Laboratoire</span>
              <span className="lab-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                Actif
              </span>
            </h1>
            <p className="lab-subtitle">Résultats transmis automatiquement au médecin prescripteur</p>
          </div>
          <button className="lab-btn-add" onClick={() => alert("Formulaire d'analyse à intégrer")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvelle Analyse
          </button>
        </div>

        
        <div className="lab-stats">
          {[
            { label: "Total Analyses", value: analysesData.length,                cls: "total",  icon: "📋" },
            { label: "Sang",           value: countBy("categorie", "Sang"),        cls: "sang",   icon: "🩸" },
            { label: "Biochimie",      value: countBy("categorie", "Biochimie"),   cls: "bio",    icon: "🧪" },
            { label: "Microbiologie",  value: countBy("categorie","Microbiologie"),cls: "micro",  icon: "🦠" },
            { label: "Hormonal",       value: countBy("categorie", "Hormonal"),    cls: "hormo",  icon: "⚗️"  },
            { label: "Urgents",        value: countBy("statut", "urgent"),         cls: "urgent", icon: "🚨" },
          ].map((s) => (
            <div key={s.cls} className={`lab-stat-card ${s.cls}`}>
              <div className="lab-stat-icon">{s.icon}</div>
              <div>
                <div className="lab-stat-label">{s.label}</div>
                <div className="lab-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="lab-ref-section">
          <div className="lab-ref-header">
            <span className="lab-ref-title">Types d'analyses disponibles</span>
            <div className="lab-ref-tabs">
              {Object.keys(typesAnalyse).map((tab) => (
                <button
                  key={tab}
                  className={`lab-ref-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {categorieConfig[tab].icon} {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="lab-ref-tags">
            {typesAnalyse[activeTab].map((t) => (
              <span key={t} className="lab-ref-tag" style={{ background: categorieConfig[activeTab].bg, color: categorieConfig[activeTab].color }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        
        <div className="lab-filters">
          <select className="lab-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="lab-select" value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="lab-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            {statuts.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" className="lab-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <div className="lab-search-wrap">
            <svg className="lab-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="lab-search"
              placeholder="Rechercher un patient ou analyse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="lab-table-wrap">
          <table className="lab-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Âge</th>
                <th>Médecin Prescripteur</th>
                <th>Catégorie</th>
                <th>Type d'Analyse</th>
                <th>Date Prélèvement</th>
                <th>Résultat</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="lab-empty">
                      <div className="lab-empty-icon">🧪</div>
                      <div className="lab-empty-title">Aucune analyse enregistrée</div>
                      <div className="lab-empty-sub">Les analyses de laboratoire apparaîtront ici</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((a) => {
                const chip    = statutLabels[a.statut];
                const catConf = categorieConfig[a.categorie];
                return (
                  <tr key={a.id} onClick={() => openModal(a)}>
                    <td>
                      <div className="lab-patient-cell">
                        <div className="lab-avatar" style={{ background: getAvatarColor(a.initiale) }}>
                          {a.initiale}
                        </div>
                        <span className="lab-patient-name">{a.nom}</span>
                      </div>
                    </td>
                    <td>{a.age}</td>
                    <td>{a.medecin}</td>
                    <td>
                      <span className="lab-cat-chip" style={{ background: catConf.bg, color: catConf.color }}>
                        {catConf.icon} {a.categorie}
                      </span>
                    </td>
                    <td>{a.typeAnalyse}</td>
                    <td>{a.datePrelevement}</td>
                    <td>
                      {a.resultat
                        ? <span className="lab-resultat">{a.resultat}</span>
                        : <span className="lab-pending">—</span>
                      }
                    </td>
                    <td>
                      <span className="lab-statut-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="lab-dot" style={{ background: chip.color }} />
                        {chip.label}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="lab-actions">
                        <button className="lab-action-btn view" onClick={() => openModal(a)}>Voir</button>
                        <button className="lab-action-btn edit" onClick={() => alert(`Modifier ${a.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="lab-footer">
            <span>Affichage de <span className="lab-count">{filtered.length}</span> sur <span className="lab-count">{analysesData.length}</span> analyses</span>
            <span>Laboratoire / Analyses — MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedAnalyse && (
        <div className="lab-modal-overlay" onClick={closeModal}>
          <div className="lab-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lab-modal-header">
              <div className="lab-avatar lab-modal-avatar" style={{ background: getAvatarColor(selectedAnalyse.initiale) }}>
                {selectedAnalyse.initiale}
              </div>
              <div>
                <div className="lab-modal-title">{selectedAnalyse.nom}</div>
                <div className="lab-modal-subtitle">Dossier analyse — Laboratoire</div>
              </div>
              <button className="lab-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="lab-modal-grid">
              {[
                { label: "Âge",                  value: selectedAnalyse.age             },
                { label: "Date Prélèvement",      value: selectedAnalyse.datePrelevement },
                { label: "Médecin Prescripteur",  value: selectedAnalyse.medecin         },
                { label: "Catégorie",             value: selectedAnalyse.categorie       },
                { label: "Type d'Analyse",        value: selectedAnalyse.typeAnalyse     },
                { label: "Résultat",              value: selectedAnalyse.resultat || "En attente" },
              ].map((f) => (
                <div key={f.label} className="lab-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>

            <div className="lab-modal-actions">
              <button className="lab-action-btn view lab-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="lab-action-btn edit lab-modal-btn" onClick={() => alert(`Modifier ${selectedAnalyse.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
