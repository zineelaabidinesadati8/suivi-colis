import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ utilisateur }) {
  return (
    <div className="layout">
      <Sidebar utilisateur={utilisateur} />
      <div className="contenu">
        <Header utilisateur={utilisateur} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}