// Fonction pour insérer des produits par défaut
const Produit=require("../models/Produit");
const generateDefaultProduits = async () => {
    try {
      // Produits par défaut
      const produits = [
        { nom_produit: "Huile moteur", unite: "litre" },
        { nom_produit: "Filtre à huile", unite: "pièce" },
        { nom_produit: "Pneu", unite: "pièce" },
        { nom_produit: "Liquide de frein", unite: "litre" },
        { nom_produit: "Batterie", unite: "pièce" },
        { nom_produit: "Courroie de distribution", unite: "pièce" }
      ];
  
      // Insérer les produits dans la base de données
      const produitsAjoutes = await Produit.insertMany(produits);
  
      console.log("Produits ajoutés avec succès:", produitsAjoutes);
    } catch (err) {
      console.log("Erreur lors de l'insertion des produits:", err);
    }
  };
  
  // Appeler la fonction pour insérer des produits
  generateDefaultProduits();