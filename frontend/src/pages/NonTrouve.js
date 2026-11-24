import { Link } from 'react-router-dom';

export default function NonTrouve() {
  return (
    <div className="carte non-trouve">
      <h2>404</h2>
      <p>Cette page n'existe pas.</p>
      <Link to="/" className="btn-primaire">Retour à l'accueil</Link>
    </div>
  );
}