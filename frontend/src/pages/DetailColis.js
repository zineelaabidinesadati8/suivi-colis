import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ColisService from '../services/ColisService';
import StatutBadge from '../components/StatutBadge';
import Timeline from '../components/Timeline';
import { STATUTS } from '../models/Colis';

export default function DetailColis({ utilisateur }) {
  const { id } = useParams();
  const [colis, setColis] = useState(undefined);
  const [historique, setHistorique] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [nouveauStatut, setNouveauStatut] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [erreur, setErreur] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const charger = async () => {
      const c = await ColisService.getColisParId(Number(id));
      setLivreurs(await ColisService.getLivreurs());
      if (!c) {
        setColis(null);
        return;
      }
      setColis({ ...c });
      setNouveauStatut(c.statut_actuel);
      setHistorique(await ColisService.getHistorique(c.id));
    };
    charger();
  }, [id, version]);

  const changerStatut = async e => {
    e.preventDefault();
    if (nouveauStatut === colis.statut_actuel) {
      setErreur('Choisissez un statut différent du statut actuel');
      return;
    }
    await ColisService.changerStatut(colis.id, nouveauStatut, commentaire);
    setCommentaire('');
    setErreur('');
    setVersion(v => v + 1);
  };

  const affecter = async e => {
    const valeur = e.target.value ? Number(e.target.value) : null;
    await ColisService.affecterLivreur(colis.id, valeur);
    setVersion(v => v + 1);
  };

  if (colis === undefined) return <p>Chargement...</p>;
  if (colis === null) return <p>Colis introuvable.</p>;

  const livreur = livreurs.find(l => l.id === colis.livreur_id);
  const retour = utilisateur.role === 'livreur' ? '/livraisons' : '/colis';

  return (
    <>
      <Link to={retour} className="lien-retour">← Retour à la liste</Link>

      <div className="detail-grille">
        <div className="carte">
          <div className="carte-titre">
            <h3>{colis.numero_suivi}</h3>
            <StatutBadge statut={colis.statut_actuel} />
          </div>
          <ul className="infos">
            <li><span>Expéditeur</span><b>{colis.expediteur}</b></li>
            <li><span>Destinataire</span><b>{colis.destinataire}</b></li>
            <li><span>Adresse</span><b>{colis.adresse}</b></li>
            <li><span>Ville</span><b>{colis.ville}</b></li>
            <li><span>Poids</span><b>{colis.poids} kg</b></li>
            <li><span>Livreur</span><b>{livreur ? livreur.nom : 'Non affecté'}</b></li>
          </ul>
        </div>

        {utilisateur.role !== 'client' && (
          <div className="carte">
            <h4>Changer le statut</h4>
            <form onSubmit={changerStatut} className="form-statut">
              <select value={nouveauStatut} onChange={e => setNouveauStatut(e.target.value)}>
                {STATUTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                rows="3"
                placeholder="Commentaire (optionnel)"
                value={commentaire}
                onChange={e => setCommentaire(e.target.value)}
              />
              {erreur && <small className="erreur">{erreur}</small>}
              <button type="submit" className="btn-primaire">Enregistrer le statut</button>
            </form>

            {utilisateur.role === 'admin' && (
              <>
                <h4>Livreur</h4>
                <select value={colis.livreur_id || ''} onChange={affecter} className="select-filtre">
                  <option value="">Non affecté</option>
                  {livreurs.map(l => (
                    <option key={l.id} value={l.id}>{l.nom}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}
      </div>

      <div className="carte">
        <h3>Historique du colis</h3>
        <Timeline etapes={historique} />
      </div>
    </>
  );
}