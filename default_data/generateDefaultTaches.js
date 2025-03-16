const mongoose = require("mongoose");
const Tache = require('../models/Tache'); // Remplace par le chemin correct de ton modèle Tache
const Service = require('../models/Service'); // Remplace par le chemin correct de ton modèle Service
const RendezVous = require('../models/RendezVous'); // Remplace par le chemin correct de ton modèle RendezVous


// Fonction pour insérer des tâches par défaut
const generateDefaultTaches = async () => {
  try {
    // Récupérer les services existants
    const services = await Service.find();
    if (services.length === 0) {
      console.log("Aucun service trouvé.");
      return;
    }

    // Récupérer les rendez-vous existants
    const rendezVous = await RendezVous.find();
    if (rendezVous.length === 0) {
      console.log("Aucun rendez-vous trouvé.");
      return;
    }

    // Créer des tâches par défaut
    const taches = [
      {
        service: services[0]._id, // Service associé à la tâche
        duree: 30, // Durée estimée pour la tâche (en minutes)
        ordre_priorite: 1, // Haute priorité
        statut: "En cours", // Statut de la tâche
        rendez_vous: rendezVous[0]._id // Rendez-vous associé
      },
      {
        service: services[1]._id,
        duree: 45,
        ordre_priorite: 2,
        statut: "Terminé",
        rendez_vous: rendezVous[1]._id
      },
      {
        service: services[2]._id,
        duree: 60,
        ordre_priorite: 3,
        statut: "En attente",
        rendez_vous: rendezVous[2]._id
      }
    ];

    // Insérer les tâches dans la base de données
    const tachesAjoutees = await Tache.insertMany(taches);

    console.log("Tâches ajoutées avec succès:", tachesAjoutees);
  } catch (err) {
    console.log("Erreur lors de l'insertion des tâches:", err);
  }
};

// Appeler la fonction pour insérer des tâches
generateDefaultTaches();
