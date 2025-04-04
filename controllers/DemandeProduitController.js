const DemandeProduitService = require("../services/DemandeProduitService");
const ProduitService = require("../services/ProduitService");
const { getIo } = require("../socket");
class DemandeProduitController {
  static async requestReassort(req, res) {
    try {
      const { entries } = req.body; // [{ produitId, quantity }]
      const userId = req.userId; // Supposons que l'utilisateur est authentifié via un middleware
      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ error: "Aucune entrée fournie" });
      }

      const result = await DemandeProduitService.createReassortRequest(
        entries,
        userId
      );
      // Émettre une notification aux admins via WebSocket
      const createdDemandes = result.data; // Tableau des demandes créées
      for (let i = 0; i < createdDemandes.length; i++) {
        const io = getIo(); // Récupérer l'instance de io
        const produit = await ProduitService.readById(
          createdDemandes[i].produit
        );
        const request = {
          _id: createdDemandes[i]._id,
          productName: produit.nom_produit || "Produit inconnu", // À ajuster selon votre modèle
          quantity: createdDemandes[i].quantite_demande,
          requestedBy: createdDemandes[i].utilisateur,
          createdAt: createdDemandes[i].date,
        };

        io.to("admin").emit("newRestockRequest", request);
      }
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listReassortRequests(req, res) {
    try {
      const { page, limit, search, sortBy, orderBy } = req.query;
      const params = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || "",
        sortBy: sortBy || "date",
        orderBy: orderBy || "desc",
      };

      const result = await DemandeProduitService.getReassortRequests(params);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async deleteStockEntry(req, res) {
    try {
      const { id } = req.params;
      const result = await DemandeProduitService.deleteStockEntry(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await DemandeProduitService.delete(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DemandeProduitController;
