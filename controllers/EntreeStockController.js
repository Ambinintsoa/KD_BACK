const EntreeStockService = require('../services/EntreeStockService');

class EntreeStockController {
  static async addStockEntry(req, res) {
    try {
      const { entries } = req.body; // [{ produitId, quantity }]
      const invoiceFile = req.file;  // Facture via multer
      const userId = req.userId;   // Utilisateur authentifié

      if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ error: 'Aucune entrée fournie' });
      }
      if (!invoiceFile) {
        return res.status(400).json({ error: 'Facture obligatoire' });
      }

      const result = await EntreeStockService.addStockEntry(entries, invoiceFile, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listStockEntries(req, res) {
    try {
      const { page, limit, search, sortBy, orderBy } = req.query;
      const params = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
        sortBy: sortBy || 'date',
        orderBy: orderBy || 'desc'
      };

      const result = await EntreeStockService.getStockEntries(params);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async deleteStockEntry(req, res) {
    try {
      const { id } = req.params;
      const result = await EntreeStockService.deleteStockEntry(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EntreeStockController;