
const StockProduit = require('../models/StockProduit'); // Remplace par le chemin correct de ton modèle StockProduit
const Produit = require('../models/Produit'); // Remplace par le chemin correct de ton modèle Produit


// Fonction pour générer des données par défaut dans le stock
const generateDefaultStockData = async () => {
  try {
    // Récupérer les produits existants
    const produits = await Produit.find();
    if (produits.length === 0) {
      console.log("Aucun produit trouvé.");
      return;
    }

    // Générer des données de stock par défaut
    const stockProduits = produits.map((produit, index) => ({
      produit: produit._id,  // Référence au produit existant
      quantite_entree: 100,  // Quantité d'entrée pour le stock
      quantite_sortie: 0,    // Quantité de sortie (initialement 0)
      prix_unitaire: produit.prix,  // Utilise le prix du produit (en supposant que le modèle Produit a un champ "prix")
      date: new Date()  // Date actuelle
    }));

    // Insérer les données par défaut dans la collection StockProduit
    const result = await StockProduit.insertMany(stockProduits);
    console.log("Données de stock insérées avec succès:", result);
  } catch (err) {
    console.log("Erreur lors de l'insertion des données de stock:", err);
  }
};

// Appeler la fonction pour insérer les données de stock par défaut
generateDefaultStockData();
