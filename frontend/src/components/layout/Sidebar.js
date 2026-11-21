import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Search, Users, Truck, Bell, Box } from 'lucide-react';

const MENU = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin'] },
  { to: '/colis', label: 'Colis', icon: Package, roles: ['admin'] },
  { to: '/livraisons', label: 'Mes livraisons', icon: Truck, roles: ['livreur'] },
  { to: '/suivi', label: 'Suivi', icon: Search, roles: ['admin', 'livreur', 'client'] },
  { to: '/utilisateurs', label: 'Utilisateurs', icon: Users, roles: ['admin'] },
  { to: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'livreur', 'client'] },
];

export default function Sidebar({ utilisateur }) {
  const liens = MENU.filter(item => item.roles.includes(utilisateur.role));

  return (
    <aside className="sidebar">
      <div className="logo">
        <Box size={26} />
        <span>Suivi<b>Colis</b></span>
      </div>

      <nav>
        {liens.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="user-card">
        <div className="avatar">{utilisateur.nom[0]}</div>
        <div>
          <div className="user-nom">{utilisateur.nom}</div>
          <div className="user-role">{utilisateur.role}</div>
        </div>
      </div>
    </aside>
  );
}