
const DetailsDevis = require('../models/DetailsDevis'); // Remplace par le chemin correct de ton modèle DetailsDevis
const Devis = require('../models/Devis'); // Remplace par le chemin correct de ton modèle Devis
const Service = require('../models/Service'); // Remplace par le chemin correct de ton modèle Service
const UsageProduitService = require('../models/UsageProduitService'); // Remplace par le chemin correct de ton modèle UsageProduitService



// Fonction pour insérer des détails de devis par défaut
const generateDefaultDetailsDevis = async () => {
  try {
    // Récupérer les devis existants
    const devis = await Devis.find();
    if (devis.length === 0) {
      console.log("Aucun devis trouvé.");
      return;
    }

    // Récupérer les services existants
    const services = await Service.find();
    if (services.length === 0) {
      console.log("Aucun service trouvé.");
      return;
    }

    // Récupérer les usages de produits pour les services
    const usagesProduitService = await UsageProduitService.find();
    
    // Créer des détails de devis par défaut
    const detailsDevis = [
      {
        prix: 50, // Prix du service
        devis: devis[0]._id, // Devis associé
        service: services[0]._id, // Service associé
        usage_produit_service: usagesProduitService.length > 0 ? usagesProduitService[0]._id : null // Usage produit service (facultatif)
      },
      {
        prix: 100,
        devis: devis[1]._id,
        service: services[1]._id,
        usage_produit_service: usagesProduitService.length > 1 ? usagesProduitService[1]._id : null
      },
      {
        prix: 150,
        devis: devis[2]._id,
        service: services[2]._id,
        usage_produit_service: usagesProduitService.length > 2 ? usagesProduitService[2]._id : null
      }
    ];

    // Insérer les détails de devis dans la base de données
    const detailsDevisAjoutes = await DetailsDevis.insertMany(detailsDevis);

    console.log("Détails de devis ajoutés avec succès:", detailsDevisAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des détails de devis:", err);
  }
};

// Appeler la fonction pour insérer des détails de devis
generateDefaultDetailsDevis();
