const StockProduit = require('../models/StockProduit');
const Produit = require('../models/Produit');
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
          cloudinary.api.ping((error, result) => {
            if (error) {
              console.error('Erreur de connexion à Cloudinary :', error);
            } else {
              console.log('Connexion à Cloudinary réussie :', result);
            }
          })
          if (invoiceFile) {
            // Upload vers Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  {
                    resource_type: 'raw', // Pour les fichiers non-image comme PDF
                    folder: 'invoices',   // Dossier dans Cloudinary
                    public_id: `${Date.now()}-${invoiceFile.originalname}`
                  },
                  (error, result) => {
                    if (error) {
                      console.error('Erreur lors de l\'upload vers Cloudinary :', error);
                      reject(error);
                    } else {
                      console.log('Upload réussi :', result.secure_url);
                      resolve(result);
                    }
                  }
                );
                // Envoyer le buffer au flux et finaliser
                stream.end(invoiceFile.buffer);
              });
              invoiceUrl = uploadResult.secure_url;
          }
    
          const stockEntries = entries.map(entry => ({
            produit: entry.produitId,
            quantite_demande :  0,
            quantite_entree: entry.quantity,
            quantite_sortie: 0,
            prix_unitaire: entry.prix || 0,
            date: new Date(),
            facture_url: invoiceUrl,
            utilisateur: userId
          }));
    
          const createdEntries = await StockProduit.insertMany(stockEntries);
          // Mettre à jour le champ "demande" dans Produit pour chaque entrée
      for (const entry of entries) {
        const produit = await Produit.findById(entry.produitId);
        let est_disponible = produit.est_disponible;
        if(produit.demande < (produit.stock+entry.quantity)){
            est_disponible = 0;
        }
        await Produit.findByIdAndUpdate(
          entry.produitId,
          { $inc: { stock: entry.quantity }, est_disponible: est_disponible   },
          { new: true } // Retourner le document mis à jour (optionnel)
        );
      }
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
          const query = {
            quantite_entree: { $gt: 0 }, // Filtrer les stocks avec une quantité entrée > 0
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
              quantity: e.quantite_entree,
              prix_unitaire: e.prix_unitaire,
              date: e.date,
              user: e.utilisateur?.nom ||'Utilisateur',  // À remplacer par une vraie référence si disponible
              invoiceUrl: e.facture_url || '/invoices/sample.pdf' // Simulé ici, à ajuster
            })),
            totalItems
          };
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des entrées de stock : ${error.message}`);
        }
    }
    static async deleteStockEntry(entryId) {
        try {
          const entry = await StockProduit.findById(entryId);
          if (!entry) {
            throw new Error('Entrée de stock non trouvée');
          }
          if (entry.public_id) { // Supposez que vous avez stocké le public_id
            await cloudinary.uploader.destroy(entry.public_id, { resource_type: 'raw' });
          }
          await StockProduit.findByIdAndDelete(entryId);
          return { success: true, message: 'Entrée de stock et fichier supprimés' };
        } catch (error) {
          throw new Error(`Erreur lors de la suppression de l’entrée : ${error.message}`);
        }
      }
}

module.exports = EntreeStockService;