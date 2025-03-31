const mongoose = require("mongoose");
const CategorieVoiture = require("../models/CategorieVoiture");

insertDefaultCategories =  async ()=> {
    const defaultCategories = [
        { nom: "SUV", statut: 1 },
        { nom: "Berline", statut: 1 },
        { nom: "Coupé", statut: 1 },
        { nom: "Hatchback", statut: 1 },
        { nom: "Pick-up", statut: 1 }
    ];

    try {
        // Vérifiez si les données existent déjà
        const existingCount = await CategorieVoiture.countDocuments();
        if (existingCount > 0) {
            console.log("Des catégories existent déjà dans la base de données. Aucune insertion effectuée.");
            return;
        }

        // Insérez les données par défaut
        const insertedCategories = await CategorieVoiture.insertMany(defaultCategories);
        console.log("Catégories par défaut insérées avec succès :", insertedCategories);
    } catch (error) {
        console.error("Erreur lors de l'insertion des catégories par défaut :", error);
    }
}
insertDefaultCategories();

