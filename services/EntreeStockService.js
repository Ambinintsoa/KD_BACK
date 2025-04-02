const StockProduit = require('../models/StockProduit');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
class EntreeStockService {
    static async addStockEntry(entries, invoiceFile, userId) {
        try {
          let invoiceUrl = null;
          if (invoiceFile) {
            // Upload vers Cloudinary
            const result = await cloudinary.uploader.upload_stream(
              { 
                resource_type: 'raw', // Pour les fichiers non-image (PDF, etc.)
                folder: 'invoices',   // Dossier dans Cloudinary
                public_id: `${Date.now()}-${invoiceFile.originalname}`
              },
              (error, result) => {
                if (error) throw new Error(`Erreur Cloudinary : ${error.message}`);
                return result;
              }
            ).end(invoiceFile.buffer);
            invoiceUrl = result.secure_url; // URL publique sécurisée
          }
    
          const stockEntries = entries.map(entry => ({
            produit: entry.produitId,
            quantite_entree: entry.quantity,
            quantite_sortie: 0,
            prix_unitaire: entry.prix_unitaire || 0,
            date: new Date(),
          }));
    
          const createdEntries = await StockProduit.insertMany(stockEntries);
          return { 
            success: true, 
            message: 'Entrées de stock enregistrées', 
            data: createdEntries,
            invoiceUrl 
          };
        } catch (error) {
          throw new Error(`Erreur lors de la création des entrées de stock : ${error.message}`);
        }
      }

  static async getStockEntries({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' }) {
    try {
      const query = search ? { 
        $or: [
          { 'produit.nom_produit': { $regex: search, $options: 'i' } }
        ]
      } : {};

      const sortOrder = orderBy === 'asc' ? 1 : -1;
      const entries = await StockProduit
        .find(query)
        .populate('produit', 'nom_produit')
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await StockProduit.countDocuments(query);

      return {
        entries: entries.map(e => ({
          _id: e._id,
          produitId: e.produit._id,
          produitNom: e.produit.nom_produit,
          quantity: e.quantite_entree,
          date: e.date,
          user: 'Utilisateur', // À remplacer par une vraie référence si disponible
          invoiceUrl: e.invoiceUrl || '/invoices/sample.pdf' // Simulé ici, à ajuster
        })),
        totalItems
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des entrées de stock : ${error.message}`);
    }
  }
}

module.exports = EntreeStockService;