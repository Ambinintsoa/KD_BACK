const DemandeProduitService = require('../services/DemandeProduitService');

class DemandeProduitController {
  static async requestReassort(req, res) {
    try {
      const { entries } = req.body; // [{ produitId, quantity }]
      const userId = req.userId;  // Supposons que l'utilisateur est authentifié via un middleware
      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ error: 'Aucune entrée fournie' });
      }

      const result = await DemandeProduitService.createReassortRequest(entries, userId);
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
        search: search || '',
        sortBy: sortBy || 'date',
        orderBy: orderBy || 'desc'
      };

      const result = await DemandeProduitService.getReassortRequests(params);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DemandeProduitController;