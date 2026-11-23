import Colis, { STATUTS } from '../models/Colis';

class ColisService {
  constructor() {
    this.colis = [];
    this.historique = [];
    this.nextId = 1;
    this.nextHistoriqueId = 1;
    this.livreurs = [
      { id: 2, nom: 'Hamza Alaoui' },
      { id: 3, nom: 'Samira Idrissi' },
    ];
    this.initialiserDonnees();
  }

  initialiserDonnees() {
    const exemples = [
      { expediteur: 'Jumia Maroc', destinataire: 'Amal Jamali', adresse: '12 Rue Hassan II', ville: 'Agadir', poids: 1.5, statut_actuel: 'En transit', livreur_id: 2 },
      { expediteur: 'Marjane', destinataire: 'Karim Fasski', adresse: '45 Bd Zerktouni', ville: 'Casablanca', poids: 4.2, statut_actuel: 'En livraison', livreur_id: 2 },
      { expediteur: 'Decathlon', destinataire: 'Nawal Ibrahimi', adresse: '8 Av Mohammed V', ville: 'Marrakech', poids: 2.8, statut_actuel: 'Livré', livreur_id: 3 },
      { expediteur: 'Amazon', destinataire: 'Youssef Manad', adresse: '3 Rue des Orangers', ville: 'Rabat', poids: 0.7 },
      { expediteur: 'Electroplanet', destinataire: 'Samira Ait Kaba', adresse: '21 Rue Founty', ville: 'Agadir', poids: 6.0, statut_actuel: 'Retourné', livreur_id: 3 },
    ];
    exemples.forEach(e => this.creer(e));
  }

  creer(data) {
    const id = this.nextId++;
    const numero = `MA${String(id).padStart(6, '0')}`;
    const colis = new Colis(
      id, numero, data.expediteur, data.destinataire,
      data.adresse, data.ville, Number(data.poids),
      data.statut_actuel || 'En attente', data.client_id || null, data.livreur_id || null
    );
    this.colis.push(colis);
    this.ajouterHistorique(id, colis.statut_actuel, 'Colis enregistré');
    return colis;
  }

  ajouterHistorique(colis_id, libelle, commentaire = '') {
    this.historique.push({
      id: this.nextHistoriqueId++,
      colis_id,
      libelle,
      commentaire,
      created_at: new Date().toISOString(),
    });
  }

  // CREATE
  async ajouterColis(data) {
    return this.creer(data);
  }

  // READ
  async getTousColis() {
    return [...this.colis];
  }

  async getColisParId(id) {
    return this.colis.find(c => c.id === id);
  }

  async getHistorique(colis_id) {
    return this.historique.filter(h => h.colis_id === colis_id);
  }

  async rechercher(terme) {
    const t = terme.toLowerCase();
    return this.colis.filter(c =>
      c.numero_suivi.toLowerCase().includes(t) ||
      c.destinataire.toLowerCase().includes(t) ||
      c.expediteur.toLowerCase().includes(t) ||
      c.ville.toLowerCase().includes(t)
    );
  }

  // UPDATE
  async modifierColis(id, donnees) {
    const index = this.colis.findIndex(c => c.id === id);
    if (index === -1) return null;
    const ancien = this.colis[index];
    this.colis[index] = { ...ancien, ...donnees, id: ancien.id, numero_suivi: ancien.numero_suivi };
    return this.colis[index];
  }

  async changerStatut(id, nouveauStatut, commentaire = '') {
    if (!STATUTS.includes(nouveauStatut)) {
      throw new Error(`Statut invalide : ${nouveauStatut}`);
    }
    const colis = this.colis.find(c => c.id === id);
    if (!colis) return null;
    colis.statut_actuel = nouveauStatut;
    this.ajouterHistorique(id, nouveauStatut, commentaire);
    return colis;
  }

  // DELETE
  async supprimerColis(id) {
    const index = this.colis.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.historique = this.historique.filter(h => h.colis_id !== id);
    return this.colis.splice(index, 1)[0];
  }

  async getLivreurs() {
    return [...this.livreurs];
  }

  async affecterLivreur(id, livreur_id) {
    const colis = this.colis.find(c => c.id === id);
    if (!colis) return null;
    colis.livreur_id = livreur_id;
    const livreur = this.livreurs.find(l => l.id === livreur_id);
    this.ajouterHistorique(id, colis.statut_actuel, livreur ? `Affecté à ${livreur.nom}` : 'Livreur retiré');
    return colis;
  }


  // Statistiques
  async getStatistiques() {
    const total = this.colis.length;
    const parStatut = {};
    STATUTS.forEach(s => {
      parStatut[s] = this.colis.filter(c => c.statut_actuel === s).length;
    });
    const poidsTotal = this.colis.reduce((somme, c) => somme + c.poids, 0);
    const villes = {};
    this.colis.forEach(c => {
      villes[c.ville] = (villes[c.ville] || 0) + 1;
    });
    const villePlusFrequente = Object.keys(villes).reduce(
      (a, b) => (villes[a] > villes[b] ? a : b), ''
    );
    return {
      total,
      parStatut,
      parVille: villes,
      poidsMoyen: total > 0 ? Math.round((poidsTotal / total) * 100) / 100 : 0,
      villePlusFrequente,
    };
  }
}

const colisService = new ColisService();
export default colisService;