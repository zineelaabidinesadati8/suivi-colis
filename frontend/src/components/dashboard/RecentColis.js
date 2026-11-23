import { Link } from 'react-router-dom';
import StatutBadge from '../StatutBadge';

export default function RecentColis({ colis }) {
  return (
    <div className="carte">
      <div className="carte-titre">
        <h3>Colis récents</h3>
        <Link to="/colis">Voir tout</Link>
      </div>
      <ul className="liste-recents">
        {colis.map(c => (
          <li key={c.id}>
            <div>
              <strong>{c.numero_suivi}</strong>
              <span>{c.expediteur} → {c.destinataire}, {c.ville}</span>
            </div>
            <StatutBadge statut={c.statut_actuel} />
          </li>
        ))}
      </ul>
    </div>
  );
}