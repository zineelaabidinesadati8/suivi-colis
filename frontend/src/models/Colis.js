export const STATUTS = ['En attente', 'En transit', 'En livraison', 'Livré', 'Retourné'];

class Colis {
  constructor(id, numero_suivi, expediteur, destinataire, adresse, ville, poids, statut_actuel = 'En attente', client_id = null) {
    this.id = id;
    this.numero_suivi = numero_suivi;
    this.expediteur = expediteur;
    this.destinataire = destinataire;
    this.adresse = adresse;
    this.ville = ville;
    this.poids = poids;
    this.statut_actuel = statut_actuel;
    this.client_id = client_id;
    this.created_at = new Date().toISOString();
  }
}

export default Colis;