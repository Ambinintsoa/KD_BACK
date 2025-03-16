const Service=require('../models/Service');
const CategorieService=require('../models/CategorieService');

// Fonction pour insérer des services par défaut
const generateDefaultServices = async () => {
  try {
    // Récupérer toutes les catégories de service
    const categories = await CategorieService.find();

    if (categories.length === 0) {
      console.log("Aucune catégorie de service trouvée.");
      return;
    }

    // Créer des services pour chaque catégorie de service
    const services = [
      // Vidange
      { 
        nom_service: "Vidange moteur", 
        duree: 1,  // Durée en heures
        prix: 50,  // Prix en €
        categorie_service: categories.find(c => c.nom_categorie === "Vidange")._id
      },
      { 
        nom_service: "Vidange de boîte de vitesses", 
        duree: 2,
        prix: 80,
        categorie_service: categories.find(c => c.nom_categorie === "Vidange")._id
      },
      { 
        nom_service: "Changement de filtre à huile", 
        duree: 1,
        prix: 20,
        categorie_service: categories.find(c => c.nom_categorie === "Vidange")._id
      },

      // Réparation moteur
      { 
        nom_service: "Réparation moteur thermique", 
        duree: 8,
        prix: 500,
        categorie_service: categories.find(c => c.nom_categorie === "Réparation moteur")._id
      },
      { 
        nom_service: "Remplacement de courroie de distribution", 
        duree: 4,
        prix: 300,
        categorie_service: categories.find(c => c.nom_categorie === "Réparation moteur")._id
      },

      // Changement de pneus
      { 
        nom_service: "Changement de pneus avant", 
        duree: 1,
        prix: 60,
        categorie_service: categories.find(c => c.nom_categorie === "Changement de pneus")._id
      },
      { 
        nom_service: "Changement de pneus arrière", 
        duree: 1,
        prix: 60,
        categorie_service: categories.find(c => c.nom_categorie === "Changement de pneus")._id
      },

      // Révision générale
      { 
        nom_service: "Révision des freins", 
        duree: 2,
        prix: 120,
        categorie_service: categories.find(c => c.nom_categorie === "Révision générale")._id
      },
      { 
        nom_service: "Vérification du système de climatisation", 
        duree: 2,
        prix: 90,
        categorie_service: categories.find(c => c.nom_categorie === "Révision générale")._id
      },

      // Peinture et carrosserie
      { 
        nom_service: "Réparation de carrosserie", 
        duree: 6,
        prix: 350,
        categorie_service: categories.find(c => c.nom_categorie === "Peinture et carrosserie")._id
      },
      { 
        nom_service: "Peinture complète", 
        duree: 20,
        prix: 1000,
        categorie_service: categories.find(c => c.nom_categorie === "Peinture et carrosserie")._id
      }
    ];

    // Insérer les services dans la base de données
    const servicesAjoutes = await Service.insertMany(services);

    console.log("Services ajoutés avec succès:", servicesAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des services:", err);
  }
};

// Appeler la fonction pour insérer des services
generateDefaultServices();