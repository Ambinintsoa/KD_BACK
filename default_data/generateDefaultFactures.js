const mongoose = require("mongoose");
const Facture = require('../models/facture'); // Remplace par le chemin correct de ton modèle Facture
const Utilisateur = require('../models/utilisateur'); // Remplace par le chemin correct de ton modèle Utilisateur

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/votreBaseDeDonnees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion réussie à MongoDB"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Fonction pour insérer des factures par défaut
const generateDefaultFactures = async () => {
  try {
    // Récupérer les utilisateurs (clients) existants
    const utilisateurs = await Utilisateur.find();
    if (utilisateurs.length === 0) {
      console.log("Aucun utilisateur trouvé.");
      return;
    }

    // Créer des factures par défaut
    const factures = [
      {
        date: new Date(), // Date actuelle de la facture
        client: utilisateurs[0]._id, // Client associé (utilisateur)
        montant_total: 300, // Montant total de la facture
        statut: "payée", // Statut de la facture
        numero_facture: "FCT-1001" // Numéro unique de la facture
      },
      {
        date: new Date(), // Date actuelle
        client: utilisateurs[1]._id,
        montant_total: 450,
        statut: "en attente",
        numero_facture: "FCT-1002"
      },
      {
        date: new Date(), // Date actuelle
        client: utilisateurs[2]._id,
        montant_total: 120,
        statut: "payée",
        numero_facture: "FCT-1003"
      }
    ];

    // Insérer les factures dans la base de données
    const facturesAjoutees = await Facture.insertMany(factures);

    console.log("Factures ajoutées avec succès:", facturesAjoutees);
  } catch (err) {
    console.log("Erreur lors de l'insertion des factures:", err);
  }
};

// Appeler la fonction pour insérer des factures
generateDefaultFactures();
