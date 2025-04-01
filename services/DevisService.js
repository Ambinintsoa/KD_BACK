const PrixServiceCategorie = require('../models/PrixServiceCategorie');
const PrixProduitMarque = require('../models/PrixProduitMarque');
const UsageProduitService = require('../models/UsageProduitService');

const getLigneDevis = async (voiture_data, liste_services) => {
    try {
        let ligne_devis = [];
        let total_devis = 0;

        for (const service of liste_services) {
            console.log("coucou",service);

            let detail_service = await getPrixCategorieVoitureByService(voiture_data.categorie, service);
            console.log(detail_service,service);
            total_devis = detail_service.prix + total_devis;

            if (service.avec_produit) {
                let { ligne_produits, total_produit }= await getProduitsComplets(voiture_data.marque, service);

                total_devis = total_devis + total_produit; //ajoute le prix total des produits

                ligne_devis.push({ service_details: detail_service, produits: ligne_produits });

            } else {
                ligne_devis.push({ service_details: detail_service, produits: [] });
            }
        }
        return { ligne_devis, total_devis };
    } catch (error) {
        throw error;
    }
}
// prends le prix de service suivant le categorie de voiture
const getPrixCategorieVoitureByService = async (categorie, service) => {
    try {
        return await PrixServiceCategorie.find(categorie, service).populate("service");
    } catch (error) {
        throw error;
    }
}
//prends la liste des produit avec leur produit utiliser par un service suivant les marques
const getProduitsComplets = async (marque, service) => {
    let ligne_produits = [];
    let produit_usages = await getProduitUsedByService(service);

    let total_produit = 0;
    for (const element of produit_usages) {
        let temp_prix_unitaire = await getPrixProduit(marque, element.produit._id);
        console.log((marque, element.produit),temp_prix_unitaire,"fonction getProduitComplets");
        total_produit = total_produit + (element.quantite * temp_prix_unitaire);
        ligne_produits.push({
            produit: element.produit,
            prix: element.quantite * temp_prix_unitaire,
            prix_unitaire: temp_prix_unitaire
        });
    }

    return { ligne_produits, total_produit };
};


// prends les produits utiliser par un service
const getProduitUsedByService = async (service) => {
    try {
        return UsageProduitService.find({ service }).populate("produit");
    } catch (error) {
        throw error;
    }
};
// prends le prix des produits par marque
const getPrixProduit = async (marque, produit) => {
    try {
        return await PrixProduitMarque.find({ marque, produit }).select("prix");
    } catch (error) {
        throw error;
    }
}


exports.Calculate = async (liste_service, voituredata) => {
    try {
        let { ligne_devis, total_devis } = await getLigneDevis(voituredata, liste_service);

        return {ligne_devis, total_devis};

    } catch (error) {

    }
}