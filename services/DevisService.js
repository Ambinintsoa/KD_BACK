const mongoose = require("mongoose");

const PrixServiceCategorie = require("../models/PrixServiceCategorie");
const PrixProduitMarque = require("../models/PrixProduitMarque");
const UsageProduitService = require("../models/UsageProduitService");

// Fonction utilitaire pour convertir en ObjectId
const toObjectId = (id) => {
    if (mongoose.isValidObjectId(id)) {
        return new mongoose.Types.ObjectId(id);
    }
    throw new Error(`Invalid ObjectId: ${id}`);
};

const getLigneDevis = async (voiture_data, liste_services) => {
    try {
        let ligne_devis = [];
        let total_devis = 0;

        for (const service of liste_services) {
           
            let detail_service = await getPrixCategorieVoitureByService(
                voiture_data.categorie,
                service.service
            );
            total_devis += detail_service?.prix || 0;

            if (service.avec_produit) {
                let { ligne_produits, total_produit } = await getProduitsComplets(
                    voiture_data.marque,
                    service.service
                );

                total_devis += total_produit;

                ligne_devis.push({ service_details: detail_service, produits: ligne_produits });
            } else {
                ligne_devis.push({ service_details: detail_service, produits: [] });
            }
        }


        return { ligne_devis, total_devis };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **Prend le prix du service suivant la catégorie de voiture**
const getPrixCategorieVoitureByService = async (categorie, service) => {
    try {
        return await PrixServiceCategorie.findOne({
            categorie_voiture: toObjectId(categorie),
            service: toObjectId(service),
        }).populate("service");
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **Prend la liste des produits utilisés par un service pour une marque donnée**
const getProduitsComplets = async (marque, service) => {
    try {
        let ligne_produits = [];
        let produit_usages = await getProduitUsedByService(service);
        let total_produit = 0;
        if (produit_usages.length<=0) {
            return { ligne_produits: null, total_produit: 0 };
        }

        for (const element of produit_usages) {
            if (element.produit) {
                let temp_prix_unitaire = await getPrixProduit(toObjectId(marque), element.produit._id);
             
                total_produit += element.quantite * temp_prix_unitaire;

                ligne_produits.push({
                    produit: element.produit,
                    quantite:element.quantite,
                    prix: element.quantite * temp_prix_unitaire,
                    prix_unitaire: temp_prix_unitaire,
                });
            }

        }

        return { ligne_produits, total_produit };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **Récupère les produits utilisés par un service**
const getProduitUsedByService = async (service) => {
    try {
        return await UsageProduitService.find({
            service: toObjectId(service),
        }).populate("produit") || [];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **Récupère le prix d’un produit selon la marque**
const getPrixProduit = async (marque, produit) => {
    try {
        let result = await PrixProduitMarque.findOne({
            marque: toObjectId(marque),
            produit: toObjectId(produit),
        }).select("prix");
        
        return result ? result.prix : 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **Export de la fonction principale**
exports.Calculate = async (nouveau_devis) => {
    try {
        let { ligne_devis, total_devis } = await getLigneDevis(
            nouveau_devis.voiture,
            nouveau_devis.services
        );
        return { ligne_devis, total_devis };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
