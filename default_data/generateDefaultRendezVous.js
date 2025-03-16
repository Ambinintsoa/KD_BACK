const mongoose = require("mongoose");
const RendezVous = require('../models/RendezVous'); // Remplace par le chemin correct de ton modèle RendezVous
const Utilisateur = require('../models/Utilisateur'); // Remplace par le chemin correct de ton modèle Utilisateur
const Voiture = require('../models/Voiture'); // Remplace par le chemin correct de ton modèle Voiture

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/votreBaseDeDonnees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion réussie à MongoDB"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Fonction pour insérer des rendez-vous par défaut
const generateDefaultRendezVous = async () => {
  try {
    // Récupérer les utilisateurs existants (clients et mécaniciens)
    const utilisateurs = await Utilisateur.find();
    if (utilisateurs.length < 2) {
      console.log("Pas assez d'utilisateurs pour générer des rendez-vous.");
      return;
    }

    // Récupérer les voitures existantes
    const voitures = await Voiture.find();
    if (voitures.length === 0) {
      console.log("Aucune voiture trouvée.");
    }

    // Créer des rendez-vous par défaut
    const rendezVous = [
      {
        date_heure_debut: new Date("2025-03-15T08:00:00Z"), // Date de début du rendez-vous
        date_heure_fin: new Date("2025-03-15T09:00:00Z"), // Date de fin du rendez-vous
        client: utilisateurs[0]._id, // Client associé au rendez-vous
        mecanicien: utilisateurs[1]._id, // Mécanicien associé (facultatif)
        voiture: voitures.length > 0 ? voitures[0]._id : null, // Voiture associée (facultatif)
        montant_total: 100, // Montant total du rendez-vous
        statut: "En attente" // Statut du rendez-vous
      },
      {
        date_heure_debut: new Date("2025-03-15T10:00:00Z"),
        date_heure_fin: new Date("2025-03-15T11:00:00Z"),
        client: utilisateurs[1]._id,
        mecanicien: utilisateurs[0]._id,
        voiture: voitures.length > 1 ? voitures[1]._id : null,
        montant_total: 150,
        statut: "Terminé"
      },
      {
        date_heure_debut: new Date("2025-03-15T14:00:00Z"),
        date_heure_fin: new Date("2025-03-15T15:00:00Z"),
        client: utilisateurs[2]._id,
        mecanicien: utilisateurs[1]._id,
        voiture: voitures.length > 2 ? voitures[2]._id : null,
        montant_total: 200,
        statut: "Annulé"
      }
    ];

    // Insérer les rendez-vous dans la base de données
    const rendezVousAjoutes = await RendezVous.insertMany(rendezVous);

    console.log("Rendez-vous ajoutés avec succès:", rendezVousAjoutes);
  } catch (err) {
    console.log("Erreur lors de l'insertion des rendez-vous:", err);
  }
};

// Appeler la fonction pour insérer des rendez-vous
generateDefaultRendezVous();
