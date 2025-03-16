const Utilisateur=require('../models/Utilisateur');
const Voiture=require('../models/Voiture');

// Fonction pour insérer des voitures par défaut
const generateDefaultCars = async () => {
    try {
      // Récupérer tous les utilisateurs existants dans la base de données
      const utilisateurs = await Utilisateur.find();
  
      if (utilisateurs.length === 0) {
        console.log("Aucun utilisateur trouvé pour associer des voitures.");
        return;
      }
  
      // Créer des voitures pour chaque utilisateur
      const voitures = utilisateurs.map((utilisateur, index) => ({
        immatriculation: `ABC${1000 + index}`,  // Immatriculation unique pour chaque voiture
        kilometrage: Math.floor(Math.random() * 100000),  // Kilométrage aléatoire
        marque: index % 2 === 0 ? "Toyota" : "Honda",  // Marque alternée
        modele: index % 2 === 0 ? "Corolla" : "Civic",  // Modèle alterné
        client: utilisateur._id,  // Référence à l'utilisateur (client)
      }));
  
      // Insérer les voitures dans la base de données
      const voituresAjoutees = await Voiture.insertMany(voitures);
  
      console.log("Voitures ajoutées avec succès:", voituresAjoutees);
    } catch (err) {
      console.log("Erreur lors de l'insertion des voitures:", err);
    }
  };
  
  // Appeler la fonction pour insérer des voitures
  generateDefaultCars();