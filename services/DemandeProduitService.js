
const StockProduit = require('../models/StockProduit');
const Produit = require('../models/Produit');

class StockProduitService {
  static async createReassortRequest(entries, userId) {
    try {
      // Créer les demandes à partir des entrées
      const demandes = entries.map(entry => ({
        produit: entry.produitId,
        quantite_demande: entry.quantity,
        quantite_entree: 0,
        quantite_sortie: 0,
        prix_unitaire: entry.prix_unitaire || 0,
        date: new Date(),
        utilisateur: userId
      }));

      // Insérer les demandes dans la collection StockProduit
      const createdDemandes = await StockProduit.insertMany(demandes);

      // Mettre à jour le champ "demande" et "est_disponible" dans Produit
      for (const entry of entries) {
        const produit = await Produit.findById(entry.produitId);
        if (!produit) {
          throw new Error(`Produit avec ID ${entry.produitId} non trouvé`);
        }

        const nouvelleDemande = produit.demande + entry.quantity;
        let disponibility = produit.est_disponible;
        if (produit.stock < nouvelleDemande) {
          disponibility = 1; // 1 signifie "en attente de réassort" (à ajuster selon votre logique)
        }

        await Produit.findByIdAndUpdate(
          entry.produitId,
          { 
            $inc: { demande: entry.quantity }, // Incrémenter la demande
            est_disponible: disponibility 
          },
          { new: true }
        );
      }

      return { 
        success: true, 
        message: 'Demandes de réassort enregistrées', 
        data: createdDemandes 
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création des demandes : ${error.message}`);
    }
  }
  static async getReassortRequests({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' }) {
        try {
          const query = {
            quantite_demande: { $gt: 0 }, // Filtrer les stocks avec une quantité demandé > 0
            ...(search ? { 
              $or: [
                { 'produit.nom_produit': { $regex: search, $options: 'i' } }
              ]
            } : {})
          };
    
          const sortOrder = orderBy === 'asc' ? 1 : -1;
          const entries = await StockProduit
            .find(query)
            .populate('produit', 'nom_produit')
            .populate('utilisateur', 'nom')
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);
    
          const totalItems = await StockProduit.countDocuments(query);
    
          return {
            entries: entries.map(e => ({
              _id: e._id,
              produitId: e.produit._id,
              produitNom: e.produit.nom_produit,
              quantity: e.quantite_demande,
              date: e.date,
              user: e.utilisateur.nom ||'Utilisateur', // À remplacer par une vraie référence si disponible
            })),
            totalItems
          };
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des demandes: ${error.message}`);
        }
    }
    static async delete(entryId) {
        try {
          const entry = await StockProduit.findByIdAndDelete(entryId);
          if (!entry) {
            throw new Error('Entrée de stock non trouvée');
          }
          // Note : Si vous voulez aussi supprimer le fichier sur Cloudinary, vous devez stocker le public_id dans la base
          return { success: true, message: 'Entrée de stock supprimée' };
        } catch (error) {
          throw new Error(`Erreur lors de la suppression de l’entrée : ${error.message}`);
        }
      }
}

module.exports = StockProduitService;