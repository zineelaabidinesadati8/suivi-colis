import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';
import ColisService from '../services/ColisService';

export default function Notifications({ utilisateur }) {
  const { rafraichir } = useOutletContext();
  const [liste, setListe] = useState([]);

  const charger = useCallback(async () => {
    setListe(await ColisService.getNotifications(utilisateur));
  }, [utilisateur]);

  useEffect(() => {
    charger();
  }, [charger]);

  const lire = async n => {
    await ColisService.marquerLue(n.id);
    await charger();
    rafraichir();
  };

  const toutLire = async () => {
    await ColisService.marquerToutesLues(liste.map(n => n.id));
    await charger();
    rafraichir();
  };

  const nonLues = liste.filter(n => !n.lu).length;

  return (
    <div className="carte">
      <div className="carte-titre">
        <h3>Notifications ({nonLues} non lue{nonLues > 1 ? 's' : ''})</h3>
        {nonLues > 0 && (
          <button className="btn-secondaire" onClick={toutLire}>
            <CheckCheck size={16} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {liste.length === 0 ? (
        <p className="message-suivi">Aucune notification</p>
      ) : (
        <ul className="notifs">
          {liste.map(n => (
            <li key={n.id} className={n.lu ? 'notif' : 'notif non-lue'}>
              <div>
                <strong>{n.numero_suivi}</strong>
                <p>{n.message}</p>
                <small>{new Date(n.created_at).toLocaleString('fr-FR')}</small>
              </div>
              <div className="actions">
                <Link to={`/colis/${n.colis_id}`} className="btn-secondaire">Voir</Link>
                {!n.lu && (
                  <button className="btn-secondaire" onClick={() => lire(n)}>Marquer lu</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}