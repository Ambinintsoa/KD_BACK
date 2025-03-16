const AvisClient=require('../models/AvisClient');
const Utilisateur = require('../models/Utilisateur'); // Remplace par le chemin correct de ton modèle Utilisateur

// Fonction pour insérer des avis par défaut
const generateDefaultAvis = async () => {
  try {
    // Récupérer tous les utilisateurs dans la base de données
    const utilisateurs = await Utilisateur.find();

    if (utilisateurs.length === 0) {
      console.log("Aucun utilisateur trouvé pour associer des avis.");
      return;
    }

    // Filtrer les utilisateurs avec le rôle 'mecanicien' (si tu veux ajouter des mécaniciens)
    const mecaniciens = utilisateurs.filter(user => user.role === 'mecanicien');

    // Créer des avis pour chaque utilisateur
    const avisClients = utilisateurs.map((utilisateur, index) => {
      // Choisir aléatoirement un mécanicien parmi les utilisateurs avec le rôle 'mecanicien'
      const mecanicien = mecaniciens.length > 0 ? mecaniciens[Math.floor(Math.random() * mecaniciens.length)] : null;

      return {
        score: Math.floor(Math.random() * 5) + 1,  // Score aléatoire entre 1 et 5
        date: new Date(),  // Date actuelle
        client: utilisateur._id,  // L'utilisateur (client) associé à l'avis
        avis: `Avis de ${utilisateur.nom} concernant la voiture.` ,  // Avis par défaut
        mecanicien: mecanicien ? mecanicien._id : null,  // L'ID du mécanicien (s'il existe)
      };
    });

    // Insérer les avis dans la base de données
    const avisAjoutes = await AvisClient.insertMany(avisClients);

    console.log("Avis ajoutés avec succès:", avisAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des avis:", err);
  }
};

// Appeler la fonction pour insérer des avis
generateDefaultAvis();
