import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import ColisService from '../services/ColisService';
import StatutBadge from '../components/StatutBadge';
import { STATUTS } from '../models/Colis';

const PAR_PAGE = 4;

export default function Colis({ utilisateur }) {
  const estAdmin = utilisateur.role === 'admin';
  const [colis, setColis] = useState([]);
  const [params] = useSearchParams();
  const [recherche, setRecherche] = useState(params.get('q') || '');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const charger = async () => {
      const tous = await ColisService.getTousColis();
      setColis(
        utilisateur.role === 'livreur'
          ? tous.filter(c => c.livreur_id === utilisateur.id)
          : tous
      );
    };
    charger();
  }, [utilisateur]);

  useEffect(() => {
    setRecherche(params.get('q') || '');
    setPage(1);
  }, [params]);

  const terme = recherche.toLowerCase();
  const filtres = colis.filter(c => {
    const correspond =
      c.numero_suivi.toLowerCase().includes(terme) ||
      c.destinataire.toLowerCase().includes(terme) ||
      c.ville.toLowerCase().includes(terme);
    const bonStatut = filtreStatut === '' || c.statut_actuel === filtreStatut;
    return correspond && bonStatut;
  });

  const totalPages = Math.max(1, Math.ceil(filtres.length / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const debut = (pageCourante - 1) * PAR_PAGE;
  const affiches = filtres.slice(debut, debut + PAR_PAGE);

  const changerRecherche = e => {
    setRecherche(e.target.value);
    setPage(1);
  };

  const changerFiltre = e => {
    setFiltreStatut(e.target.value);
    setPage(1);
  };

  const supprimer = async c => {
    if (window.confirm(`Supprimer le colis ${c.numero_suivi} ?`)) {
      await ColisService.supprimerColis(c.id);
      setColis(colis.filter(x => x.id !== c.id));
    }
  };

  return (
    <div className="carte">
      <div className="carte-titre">
        <h3>
          {utilisateur.role === 'livreur' ? 'Mes livraisons' : 'Liste des colis'} ({filtres.length})
        </h3>
        {estAdmin && (
          <Link to="/colis/nouveau" className="btn-primaire">
            <Plus size={18} /> Nouveau colis
          </Link>
        )}
      </div>

      <div className="barre-outils">
        <div className="recherche">
          <Search size={18} />
          <input
            type="text"
            placeholder="Numéro, destinataire ou ville..."
            value={recherche}
            onChange={changerRecherche}
          />
        </div>
        <select value={filtreStatut} onChange={changerFiltre} className="select-filtre">
          <option value="">Tous les statuts</option>
          {STATUTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="tableau-zone">
        <table className="tableau">
          <thead>
            <tr>
              <th>N° suivi</th>
              <th>Destinataire</th>
              <th>Ville</th>
              <th>Poids</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {affiches.length === 0 ? (
              <tr>
                <td colSpan="7" className="vide">Aucun colis trouvé</td>
              </tr>
            ) : (
              affiches.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.numero_suivi}</strong></td>
                  <td>{c.destinataire}</td>
                  <td>{c.ville}</td>
                  <td>{c.poids} kg</td>
                  <td><StatutBadge statut={c.statut_actuel} /></td>
                  <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/colis/${c.id}`} className="btn-icone" title="Détails">
                        <Eye size={16} />
                      </Link>
                      {estAdmin && (
                        <>
                          <Link to={`/colis/${c.id}/modifier`} className="btn-icone" title="Modifier">
                            <Pencil size={16} />
                          </Link>
                          <button className="btn-icone danger" title="Supprimer" onClick={() => supprimer(c)}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={pageCourante === 1} onClick={() => setPage(pageCourante - 1)}>
          Précédent
        </button>
        <span>Page {pageCourante} sur {totalPages}</span>
        <button disabled={pageCourante === totalPages} onClick={() => setPage(pageCourante + 1)}>
          Suivant
        </button>
      </div>
    </div>
  );
}