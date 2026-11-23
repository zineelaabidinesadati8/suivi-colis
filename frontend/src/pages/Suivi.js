import { useState } from 'react';
import { Search } from 'lucide-react';
import ColisService from '../services/ColisService';
import StatutBadge from '../components/StatutBadge';
import Timeline from '../components/Timeline';

const ETAPES = ['En attente', 'En transit', 'En livraison', 'Livré'];

export default function Suivi() {
  const [numero, setNumero] = useState('');
  const [colis, setColis] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [message, setMessage] = useState('');

  const rechercher = async e => {
    e.preventDefault();
    setColis(null);

    if (!numero.trim()) {
      setMessage('Saisissez un numéro de suivi');
      return;
    }

    const c = await ColisService.getColisParNumero(numero);
    if (!c) {
      setMessage(`Aucun colis trouvé pour « ${numero.trim()} »`);
      return;
    }

    setMessage('');
    setColis({ ...c });
    setHistorique(await ColisService.getHistorique(c.id));
  };

  const indexActuel = colis ? ETAPES.indexOf(colis.statut_actuel) : -1;

  return (
    <>
      <div className="carte">
        <h3>Suivre un colis</h3>
        <form onSubmit={rechercher} className="suivi-form">
          <div className="recherche">
            <Search size={18} />
            <input
              type="text"
              placeholder="Numéro de suivi, ex: MA000001"
              value={numero}
              onChange={e => setNumero(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primaire">Suivre</button>
        </form>
        {message && <p className="message-suivi">{message}</p>}
      </div>

      {colis && (
        <>
          <div className="carte" style={{ marginTop: 20 }}>
            <div className="carte-titre">
              <h3>{colis.numero_suivi}</h3>
              <StatutBadge statut={colis.statut_actuel} />
            </div>

            {colis.statut_actuel === 'Retourné' ? (
              <p className="message-suivi">Ce colis a été retourné à l'expéditeur.</p>
            ) : (
              <ol className="etapes">
                {ETAPES.map((etape, i) => (
                  <li key={etape} className={i <= indexActuel ? 'fait' : ''}>
                    <span className="etape-point">{i + 1}</span>
                    <span className="etape-nom">{etape}</span>
                  </li>
                ))}
              </ol>
            )}

            <ul className="infos">
              <li><span>Expéditeur</span><b>{colis.expediteur}</b></li>
              <li><span>Destinataire</span><b>{colis.destinataire}</b></li>
              <li><span>Destination</span><b>{colis.adresse}, {colis.ville}</b></li>
            </ul>
          </div>

          <div className="carte" style={{ marginTop: 20 }}>
            <h3>Historique</h3>
            <Timeline etapes={historique} />
          </div>
        </>
      )}
    </>
  );
}