import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

export default function Header({ utilisateur , nbNonLues }) {
  return (
    <header className="header">
      <div>
        <h1>Bonjour, {utilisateur.nom}</h1>
        <p>Voici ce qui se passe avec vos livraisons.</p>
      </div>

      <div className="header-actions">
        <div className="recherche">
          <Search size={18} />
          <input type="text" placeholder="Rechercher..." />
        </div>
        <Link to="/notifications" className="icone-btn" aria-label="Notifications">
          <Bell size={20} />
          {nbNonLues > 0 && <span className="badge">{nbNonLues}</span>}
        </Link>
      </div>
    </header>
  );
}