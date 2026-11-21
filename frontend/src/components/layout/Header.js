import { Search, Bell } from 'lucide-react';

export default function Header({ utilisateur }) {
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
        <button className="icone-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
      </div>
    </header>
  );
}