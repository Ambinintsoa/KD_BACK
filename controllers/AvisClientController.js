const AvisClientService = require('../services/AvisClientService');
const { getIo } = require("../socket");
class AvisClientController {
  static async createAvis(req, res) {
    try {
      const avisData = { ...req.body, client: req.userId }; // client = utilisateur connecté
      const result = await AvisClientService.createAvis(avisData);
      const request = {
        _id: result.data._id
      };
      const io = getIo();
      io.to("admin").emit("newComment", request);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listAvis(req, res) {
    try {
      const { page, limit, search, sortBy, orderBy } = req.query;
      const result = await AvisClientService.getAvis({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search: search || '',
        sortBy: sortBy || 'date',
        orderBy: orderBy || 'desc'
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async validateAvis(req, res) {
    try {
      const { id } = req.params;
      const result = await AvisClientService.validateAvis(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteAvis(req, res) {
    try {
      const { id } = req.params;
      const result = await AvisClientService.deleteAvis(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getValidatedAvisRandom(req, res) {
    try {
      const { limit } = req.query; // Optionnel : limiter le nombre d’avis
      const result = await AvisClientService.getValidatedAvisRandom(parseInt(limit) || 5);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AvisClientController;