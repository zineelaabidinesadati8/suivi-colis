import Colis, { STATUTS } from '../models/Colis';

class ColisService {
  constructor() {
    this.colis = [];
    this.historique = [];
    this.nextId = 1;
    this.nextHistoriqueId = 1;
    this.utilisateurs = [
      { id: 1, nom: 'Admin Test', email: 'admin@suivicolis.ma', role: 'admin' },
      { id: 2, nom: 'Hamza Alaoui', email: 'hamza@suivicolis.ma', role: 'livreur' },
      { id: 3, nom: 'Samira Idrissi', email: 'samira@suivicolis.ma', role: 'livreur' },
      { id: 4, nom: 'Amal Jamali', email: 'amal@example.com', role: 'client' },
      { id: 5, nom: 'Karim Fasski', email: 'karim@example.com', role: 'client' },
    ];
    this.notifications = [];
    this.nextNotifId = 1;
    this.initialiserDonnees();
  }

  initialiserDonnees() {
    const exemples = [
      { expediteur: 'Jumia Maroc', destinataire: 'Amal Jamali', adresse: '12 Rue Hassan II', ville: 'Agadir', poids: 1.5, statut_actuel: 'En transit', livreur_id: 2 , client_id: 4 },
      { expediteur: 'Marjane', destinataire: 'Karim Fasski', adresse: '45 Bd Zerktouni', ville: 'Casablanca', poids: 4.2, statut_actuel: 'En livraison', livreur_id: 2 , client_id: 5 },
      { expediteur: 'Decathlon', destinataire: 'Nawal Ibrahimi', adresse: '8 Av Mohammed V', ville: 'Marrakech', poids: 2.8, statut_actuel: 'Livré', livreur_id: 3 },
      { expediteur: 'Amazon', destinataire: 'Youssef Manad', adresse: '3 Rue des Orangers', ville: 'Rabat', poids: 0.7 },
      { expediteur: 'Electroplanet', destinataire: 'Samira Ait Kaba', adresse: '21 Rue Founty', ville: 'Agadir', poids: 6.0, statut_actuel: 'Retourné', livreur_id: 3 },
    ];
    exemples.forEach(e => this.creer(e));
    this.ajouterNotification(this.colis[1], 'Le colis est en cours de livraison');
    this.ajouterNotification(this.colis[2], 'Le colis a été livré');
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
    const colis = this.creer(data);
    this.ajouterNotification(colis, 'Nouveau colis enregistré');
    return colis;
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

  async getColisParNumero(numero) {
    return this.colis.find(
      c => c.numero_suivi.toLowerCase() === numero.trim().toLowerCase()
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
    this.ajouterNotification(colis, `Nouveau statut : ${nouveauStatut}`);
    return colis;
  }

  // DELETE
  async supprimerColis(id) {
    const index = this.colis.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.historique = this.historique.filter(h => h.colis_id !== id);
    this.notifications = this.notifications.filter(n => n.colis_id !== id);
    return this.colis.splice(index, 1)[0];
  }

  async getLivreurs() {
    return this.utilisateurs.filter(u => u.role === 'livreur');
  }

  async affecterLivreur(id, livreur_id) {
    const colis = this.colis.find(c => c.id === id);
    if (!colis) return null;
    colis.livreur_id = livreur_id;
    const livreur = this.utilisateurs.find(u => u.id === livreur_id);
    this.ajouterHistorique(id, colis.statut_actuel, livreur ? `Affecté à ${livreur.nom}` : 'Livreur retiré');
    return colis;
  }

  ajouterNotification(colis, message) {
    this.notifications.push({
      id: this.nextNotifId++,
      colis_id: colis.id,
      numero_suivi: colis.numero_suivi,
      message,
      lu: false,
      created_at: new Date().toISOString(),
    });
  }

  async getNotifications(utilisateur) {
    return this.notifications
      .filter(n => {
        if (utilisateur.role === 'admin') return true;
        const c = this.colis.find(x => x.id === n.colis_id);
        if (!c) return false;
        return utilisateur.role === 'livreur'
          ? c.livreur_id === utilisateur.id
          : c.client_id === utilisateur.id;
      })
      .reverse();
  }

  async marquerLue(id) {
    const n = this.notifications.find(x => x.id === id);
    if (n) n.lu = true;
  }

  async marquerToutesLues(ids) {
    this.notifications.forEach(n => {
      if (ids.includes(n.id)) n.lu = true;
    });
  }

  async compterNonLues(utilisateur) {
    const liste = await this.getNotifications(utilisateur);
    return liste.filter(n => !n.lu).length;
  }

  async getUtilisateurs() {
    return [...this.utilisateurs];
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