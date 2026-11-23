import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ColisService from '../services/ColisService';

const VIDE = { expediteur: '', destinataire: '', adresse: '', ville: '', poids: '' };

function valider(f) {
  const erreurs = {};
  if (f.expediteur.trim().length < 2) erreurs.expediteur = "L'expéditeur est obligatoire (2 caractères min.)";
  if (f.destinataire.trim().length < 3) erreurs.destinataire = 'Le destinataire est obligatoire (3 caractères min.)';
  if (!f.adresse.trim()) erreurs.adresse = "L'adresse est obligatoire";
  if (!f.ville.trim()) erreurs.ville = 'La ville est obligatoire';
  const poids = Number(f.poids);
  if (!(poids > 0) || poids > 50) erreurs.poids = 'Le poids doit être entre 0 et 50 kg';
  return erreurs;
}

function Champ({ label, name, valeur, erreur, onChange, type = 'text', placeholder }) {
  return (
    <div className="champ">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        step={type === 'number' ? '0.1' : undefined}
        value={valeur}
        onChange={onChange}
        placeholder={placeholder}
        className={erreur ? 'invalide' : ''}
      />
      {erreur && <small className="erreur">{erreur}</small>}
    </div>
  );
}

export default function FormulaireColis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modeEdition = Boolean(id);

  const [form, setForm] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [chargement, setChargement] = useState(modeEdition);

  useEffect(() => {
    if (!modeEdition) return;
    const charger = async () => {
      const c = await ColisService.getColisParId(Number(id));
      if (!c) {
        navigate('/colis');
        return;
      }
      setForm({
        expediteur: c.expediteur,
        destinataire: c.destinataire,
        adresse: c.adresse,
        ville: c.ville,
        poids: c.poids,
      });
      setChargement(false);
    };
    charger();
  }, [id, modeEdition, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErreurs({ ...erreurs, [name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = valider(form);
    setErreurs(err);
    if (Object.keys(err).length > 0) return;

    const donnees = { ...form, poids: Number(form.poids) };
    if (modeEdition) {
      await ColisService.modifierColis(Number(id), donnees);
    } else {
      await ColisService.ajouterColis(donnees);
    }
    navigate('/colis');
  };

  if (chargement) return <p>Chargement...</p>;

  return (
    <div className="carte">
      <h3>{modeEdition ? 'Modifier le colis' : 'Nouveau colis'}</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div className="formulaire-grille">
          <Champ label="Expéditeur *" name="expediteur" valeur={form.expediteur} erreur={erreurs.expediteur} onChange={handleChange} placeholder="ex: Jumia Maroc" />
          <Champ label="Destinataire *" name="destinataire" valeur={form.destinataire} erreur={erreurs.destinataire} onChange={handleChange} placeholder="ex: Amal Jamali" />
          <Champ label="Adresse *" name="adresse" valeur={form.adresse} erreur={erreurs.adresse} onChange={handleChange} placeholder="ex: 12 Rue Hassan II" />
          <Champ label="Ville *" name="ville" valeur={form.ville} erreur={erreurs.ville} onChange={handleChange} placeholder="ex: Agadir" />
          <Champ label="Poids (kg) *" name="poids" type="number" valeur={form.poids} erreur={erreurs.poids} onChange={handleChange} placeholder="ex: 2.5" />
        </div>

        <div className="formulaire-actions">
          <Link to="/colis" className="btn-secondaire">Annuler</Link>
          <button type="submit" className="btn-primaire">
            {modeEdition ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}