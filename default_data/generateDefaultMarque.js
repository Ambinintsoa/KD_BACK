const mongoose = require("mongoose");
const Marque = require("../models/Marque"); // Remplacez par le chemin vers votre modèle

/**
 * Fonction pour insérer des données par défaut dans la collection Marque
 */
const  insertDefaultMarques=async() =>{
    const defaultMarques = [
        { nom_marque: "Toyota", statut: 1 },
        { nom_marque: "Ford", statut: 1 },
        { nom_marque: "BMW", statut: 1 },
        { nom_marque: "Mercedes", statut: 1 },
        { nom_marque: "Audi", statut: 1 }
    ];

    try {
        // Vérifiez si les données existent déjà
        const existingCount = await Marque.countDocuments();
        if (existingCount > 0) {
            console.log("Des marques existent déjà dans la base de données. Aucune insertion effectuée.");
            return;
        }

        // Insérez les données par défaut
        const insertedMarques = await Marque.insertMany(defaultMarques);
        console.log("Marques par défaut insérées avec succès :", insertedMarques);
    } catch (error) {
        console.error("Erreur lors de l'insertion des marques par défaut :", error);
    }
}
insertDefaultMarques();
