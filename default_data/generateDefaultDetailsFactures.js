
const Facture = require('../models/Facture'); // Remplace par le chemin correct de ton modèle Facture
const DetailsFacture = require('../models/DetailsFacture'); // Remplace par le chemin correct de ton modèle DetailsFacture
const Service = require('../models/Service'); // Remplace par le chemin correct de ton modèle Service
const Produit = require('../models/Produit'); // Remplace par le chemin correct de ton modèle Produit

// Fonction pour insérer des détails de facture par défaut
const generateDefaultDetailsFactures = async () => {
  try {
    // Récupérer les factures existantes
    const factures = await Facture.find();
    if (factures.length === 0) {
      console.log("Aucune facture trouvée.");
      return;
    }

    // Récupérer les services existants
    const services = await Service.find();
    if (services.length === 0) {
      console.log("Aucun service trouvé.");
    }

    // Récupérer les produits existants
    const produits = await Produit.find();
    if (produits.length === 0) {
      console.log("Aucun produit trouvé.");
    }

    // Créer des détails de facture par défaut
    const detailsFactures = [
      {
        prix: 50, // Prix de l'article/service
        facture: factures[0]._id, // Facture associée
        service: services.length > 0 ? services[0]._id : null, // Service associé (facultatif)
        produit: produits.length > 0 ? produits[0]._id : null, // Produit associé (facultatif)
        quantite: 2 // Quantité de l'article/service
      },
      {
        prix: 120,
        facture: factures[1]._id,
        service: services.length > 1 ? services[1]._id : null,
        produit: produits.length > 1 ? produits[1]._id : null,
        quantite: 1
      },
      {
        prix: 30,
        facture: factures[2]._id,
        service: services.length > 2 ? services[2]._id : null,
        produit: produits.length > 2 ? produits[2]._id : null,
        quantite: 3
      }
    ];

    // Insérer les détails de facture dans la base de données
    const result = await DetailsFacture.insertMany(detailsFactures);
    console.log("Détails de facture insérés avec succès:", result);
  } catch (err) {
    console.log("Erreur lors de l'insertion des détails de facture:", err);
  }
};

// Appeler la fonction pour insérer les détails par défaut
generateDefaultDetailsFactures();