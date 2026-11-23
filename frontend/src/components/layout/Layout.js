import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ColisService from '../../services/ColisService';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ utilisateur }) {
  const [nbNonLues, setNbNonLues] = useState(0);
  const location = useLocation();

  const rafraichir = useCallback(async () => {
    setNbNonLues(await ColisService.compterNonLues(utilisateur));
  }, [utilisateur]);

  useEffect(() => {
    rafraichir();
  }, [rafraichir, location.pathname]);

  return (
    <div className="layout">
      <Sidebar utilisateur={utilisateur} />
      <div className="contenu">
        <Header utilisateur={utilisateur} nbNonLues={nbNonLues} />
        <main>
          <Outlet context={{ rafraichir }} />
        </main>
      </div>
    </div>
  );
}