const Facture = require("../models/Facture");
const DetailsFacture = require("../models/DetailsFacture");

exports.saveDetailsFacture = async (details_facture_object, id_facture, session_object) => {
    try {
        console.log(details_facture_object);
        if (details_facture_object.service_details) {
            // Sauvegarde du service
            let temp_service = new DetailsFacture({
                prix: details_facture_object.service_details.prix,
                facture: id_facture,
                service: details_facture_object.service_details._id
            });
            await temp_service.save({ session: session_object });

        }



        // Sauvegarde des produits s'il y en a
        if (details_facture_object.produits?.length > 0) {
            for (const produit of details_facture_object.produits) {
                let temp_produit = new DetailsFacture({
                    prix: produit.prix,
                    quantite: produit.quantite, 
                    facture: id_facture,
                    produit: produit.produit._id
                });

                await temp_produit.save({ session: session_object });
            }
        }

    } catch (error) {
        console.error("Erreur lors de l'enregistrement des détails de la facture :", error);
        throw error;
    }
};

exports.saveFacture = async (data_facture, rendez_vous, client, session_object) => {
    try {
        console.log(data_facture.devis_details, data_facture.total_devis);

        let facture_object = new Facture({
            rendez_vous: rendez_vous,
            montant_total: data_facture.total_devis,
            client: client,
            numero_facture: "FAC0" + await getNumeroFacture(),
            date: new Date()
        });

        // Sauvegarde avec session
        let last_facture = await facture_object.save({ session: session_object });

        // Sauvegarde des détails de devis liés à la facture
        for (const details of data_facture.devis_details) {
            await this.saveDetailsFacture(details, last_facture._id, session_object);
        }

    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la facture :", error);
        throw error;
    }
};

const getNumeroFacture = async () => {
    try {
        let count = await Facture.countDocuments();
        return count + 1;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de facture :", error);
        throw error;
    }
};
