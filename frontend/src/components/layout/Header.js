import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

export default function Header({ utilisateur, nbNonLues }) {
  const [terme, setTerme] = useState('');
  const navigate = useNavigate();

  const rechercher = e => {
    e.preventDefault();
    const base = utilisateur.role === 'livreur' ? '/livraisons' : '/colis';
    navigate(`${base}?q=${encodeURIComponent(terme.trim())}`);
  };

  return (
    <header className="header">
      <div>
        <h1>Bonjour, {utilisateur.nom}</h1>
        <p>Voici ce qui se passe avec vos livraisons.</p>
      </div>

      <div className="header-actions">
        {utilisateur.role !== 'client' && (
          <form className="recherche" onSubmit={rechercher}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher un colis..."
              value={terme}
              onChange={e => setTerme(e.target.value)}
            />
          </form>
        )}
        <Link to="/notifications" className="icone-btn" aria-label="Notifications">
          <Bell size={20} />
          {nbNonLues > 0 && <span className="badge">{nbNonLues}</span>}
        </Link>
      </div>
    </header>
  );
}