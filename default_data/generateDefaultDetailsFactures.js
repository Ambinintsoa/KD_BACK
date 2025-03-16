const mongoose = require("mongoose");
const Facture = require('../models/Facture'); // Remplace par le chemin correct de ton modèle Facture
const DetailsFacture = require('../models/DetailsFacture'); // Remplace par le chemin correct de ton modèle DetailsFacture
const Service = require('../models/Service'); // Remplace par le chemin correct de ton modèle Service
const Produit = require('../models/Produit'); // Remplace par le chemin correct de ton modèle Produit


// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/votreBaseDeDonnees", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connexion réussie à MongoDB"))
.catch((err) => console.log("Erreur de connexion à MongoDB:", err));

// Fonction pour insérer des détails de facture par défaut
const generateDefaultDetailsFactures = async () => {
  try {
    // Récupérer les factures existantes
    const factures = await Facture.find();
    if (factures.length === 0) {
      console.log("Aucune facture trouvée.");
      return;
    }

    // Récupérer les services existants
    const services = await Service.find();
    if (services.length === 0) {
      console.log("Aucun service trouvé.");
    }

    // Récupérer les produits existants
    const produits = await Produit.find();
    if (produits.length === 0) {
      console.log("Aucun produit trouvé.");
    }

    // Créer des détails de facture par défaut
    const detailsFactures = [
      {
        prix: 50, // Prix de l'article/service
        facture: factures[0]._id, // Facture associée
        service: services.length > 0 ? services[0]._id : null, // Service associé (facultatif)
        produit: produits.length > 0 ? produits[0]._id : null, // Produit associé (facultatif)
        quantite: 2 // Quantité de l'article/service
      },
      {
        prix: 120,
        facture: factures[1]._id,
        service: services.length > 1 ? services[1]._id : null,
        produit: produits.length > 1 ? produits[1]._id : null,
        quantite: 1
      },
      {
        prix: 30,
        facture: factures[2]._id,
        service: services.length > 2 ? services[2]._id : null,
        produit: produits.length > 2
