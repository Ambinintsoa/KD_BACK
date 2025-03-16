
const UsageProduitService = require('../models/usageProduitService');  // Remplace par le chemin correct de ton modèle UsageProduitService
const Service = require('../models/service'); // Remplace par le chemin correct de ton modèle Service
const Produit = require('../models/produit'); // Remplace par le chemin correct de ton modèle Produit


// Fonction pour insérer des données pour UsageProduitService
const generateDefaultUsageProduitService = async () => {
  try {
    // Récupérer les services existants
    const services = await Service.find();
    if (services.length === 0) {
      console.log("Aucun service trouvé.");
      return;
    }

    // Récupérer les produits existants
    const produits = await Produit.find();
    if (produits.length === 0) {
      console.log("Aucun produit trouvé.");
      return;
    }

    // Créer des enregistrements UsageProduitService pour associer les services et les produits
    const usages = [
      { 
        service: services[0]._id, // Service associé
        produit: produits[0]._id,  // Produit associé
        quantite: 2  // Quantité utilisée
      },
      { 
        service: services[1]._id,
        produit: produits[1]._id,
        quantite: 1
      },
      { 
        service: services[2]._id,
        produit: produits[2]._id,
        quantite: 4
      },
      { 
        service: services[3]._id,
        produit: produits[3]._id,
        quantite: 3
      }
    ];

    // Insérer les données dans la collection UsageProduitService
    const usagesAjoutes = await UsageProduitService.insertMany(usages);

    console.log("Usages de produits pour services ajoutés avec succès:", usagesAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des usages de produits:", err);
  }
};

// Appeler la fonction pour insérer les usages de produits pour services
generateDefaultUsageProduitService();
