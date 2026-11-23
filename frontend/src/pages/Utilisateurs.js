import { useEffect, useState } from 'react';
import ColisService from '../services/ColisService';

const CLASSES_ROLE = { admin: 'statut-violet', livreur: 'statut-bleu', client: 'statut-gris' };

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const charger = async () => {
      setUsers(await ColisService.getUtilisateurs());
    };
    charger();
  }, []);

  const affiches = role ? users.filter(u => u.role === role) : users;

  return (
    <div className="carte">
      <div className="carte-titre">
        <h3>Utilisateurs ({affiches.length})</h3>
        <select value={role} onChange={e => setRole(e.target.value)} className="select-filtre">
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="livreur">Livreur</option>
          <option value="client">Client</option>
        </select>
      </div>

      <div className="tableau-zone">
        <table className="tableau">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
            </tr>
          </thead>
          <tbody>
            {affiches.map(u => (
              <tr key={u.id}>
                <td><strong>{u.nom}</strong></td>
                <td>{u.email}</td>
                <td><span className={`statut ${CLASSES_ROLE[u.role]}`}>{u.role}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}