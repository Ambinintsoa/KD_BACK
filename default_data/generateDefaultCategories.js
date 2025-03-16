const CategorieService=require('../models/CategorieService');

const generateDefaultCategories = async () => {
    try {
      // Créer des catégories de service par défaut
      const categories = [
        { nom_categorie: "Vidange" },
        { nom_categorie: "Réparation moteur" },
        { nom_categorie: "Changement de pneus" },
        { nom_categorie: "Contrôle technique" },
        { nom_categorie: "Révision générale" },
        { nom_categorie: "Peinture et carrosserie" },
        { nom_categorie: "Réparation de freins" }
      ];
  
      // Insérer les catégories de service dans la base de données
      const categoriesAjoutees = await CategorieService.insertMany(categories);
  
      console.log("Catégories de service ajoutées avec succès:", categoriesAjoutees);
    } catch (err) {
      console.log("Erreur lors de l'insertion des catégories de service:", err);
    }
  };
  
  // Appeler la fonction pour insérer des catégories de service
  generateDefaultCategories();