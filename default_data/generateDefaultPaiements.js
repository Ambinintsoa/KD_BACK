const mongoose = require("mongoose");
const Paiement = require('../models/Paiement'); // Remplace par le chemin correct de ton modèle Paiement
const Facture = require('../models/Facture'); // Remplace par le chemin correct de ton modèle Facture

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/votreBaseDeDonnees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion réussie à MongoDB"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Fonction pour insérer des paiements par défaut
const generateDefaultPaiements = async () => {
  try {
    // Récupérer les factures existantes
    const factures = await Facture.find();
    if (factures.length === 0) {
      console.log("Aucune facture trouvée.");
      return;
    }

    // Créer des paiements par défaut
    const paiements = [
      {
        date_heure: new Date(), // Date et heure actuelles du paiement
        facture: factures[0]._id, // Facture associée
        montant_payer: 150 // Montant payé
      },
      {
        date_heure: new Date(), // Date et heure actuelles du paiement
        facture: factures[1]._id,
        montant_payer: 300
      },
      {
        date_heure: new Date(), // Date et heure actuelles du paiement
        facture: factures[2]._id,
        montant_payer: 120
      }
    ];

    // Insérer les paiements dans la base de données
    const paiementsAjoutes = await Paiement.insertMany(paiements);

    console.log("Paiements ajoutés avec succès:", paiementsAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des paiements:", err);
  }
};

// Appeler la fonction pour insérer des paiements
generateDefaultPaiements();
