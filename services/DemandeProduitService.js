const DemandeProduit = require('../models/DemandeProduit');

class DemandeProduitService {
  static async createReassortRequest(entries, userId) {
    try {
      const demandes = entries.map(entry => ({
        produit: entry.produitId,
        quantite: entry.quantity,
        date: new Date(),
        utilisateur: userId
      }));

      const createdDemandes = await DemandeProduit.insertMany(demandes);
      return { success: true, message: 'Demandes de réassort enregistrées', data: createdDemandes };
    } catch (error) {
      throw new Error(`Erreur lors de la création des demandes : ${error.message}`);
    }
  }

  static async getReassortRequests({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' }) {
    try {
      const query = search ? { 
        $or: [
          { 'produit.nom_produit': { $regex: search, $options: 'i' } },
          { 'utilisateur.nom': { $regex: search, $options: 'i' } }
        ]
      } : {};

      const sortOrder = orderBy === 'asc' ? 1 : -1;
      const demandes = await DemandeProduit
        .find(query)
        .populate('produit', 'nom_produit') // Récupérer le nom du produit
        .populate('utilisateur', 'nom')     // Récupérer le nom de l'utilisateur
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await DemandeProduit.countDocuments(query);

      return {
        requests: demandes.map(d => ({
          _id: d._id,
          produitId: d.produit._id,
          produitNom: d.produit.nom_produit,
          quantity: d.quantite,
          date: d.date,
          user: d.utilisateur.nom
        })),
        totalItems
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des demandes : ${error.message}`);
    }
  }
}

module.exports = DemandeProduitService;