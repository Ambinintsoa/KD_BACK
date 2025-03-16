const Devis = require('../models/Devis'); // Remplace par le chemin correct de ton modèle Devis
const Utilisateur = require('../models/Utilisateur'); // Remplace par le chemin correct de ton modèle Utilisateur
const Voiture = require('../models/Voiture'); // Remplace par le chemin correct de ton modèle Voiture

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/votreBaseDeDonnees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion réussie à MongoDB"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Fonction pour insérer des devis par défaut
const generateDefaultDevis = async () => {
  try {
    // Récupérer les utilisateurs (clients) existants
    const utilisateurs = await Utilisateur.find();
    if (utilisateurs.length === 0) {
      console.log("Aucun utilisateur trouvé.");
      return;
    }

    // Récupérer les voitures existantes
    const voitures = await Voiture.find();
    if (voitures.length === 0) {
      console.log("Aucune voiture trouvée.");
      return;
    }

    // Créer des devis par défaut
    const devis = [
      {
        date: new Date(), // Date actuelle
        client: utilisateurs[0]._id, // Utilisateur associé (client)
        montant_total: 200, // Montant total (à ajuster selon les services)
        voiture: voitures[0]._id // Voiture associée
      },
      {
        date: new Date(), // Date actuelle
        client: utilisateurs[1]._id,
        montant_total: 150,
        voiture: voitures[1]._id
      },
      {
        date: new Date(), // Date actuelle
        client: utilisateurs[2]._id,
        montant_total: 250,
        voiture: voitures[2]._id
      }
    ];

    // Insérer les devis dans la base de données
    const devisAjoutes = await Devis.insertMany(devis);

    console.log("Devis ajoutés avec succès:", devisAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des devis:", err);
  }
};

// Appeler la fonction pour insérer des devis
generateDefaultDevis();