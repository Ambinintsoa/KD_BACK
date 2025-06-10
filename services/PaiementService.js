const Paiement = require('../models/Paiement');
const Facture = require('../models/Facture');
const mongoose = require('mongoose');

exports.save = async (paiement_data) => {
    const error_field = [];
    const session = await mongoose.startSession();  // Démarrer une session

    try {

        const paiement = new Paiement();
        paiement.date_heure = paiement_data.date_heure;
        paiement.facture = paiement_data.facture;
        paiement.montant_payer = paiement_data.montant_payer;
        console.log(paiement.facture, paiement.montant_payer, paiement.facture);

        if (!paiement.facture) {
            error_field.push({ field: "facture", message: "La facture est obligatoire!" });
        }
        if (paiement.montant_payer < 0) {
            error_field.push({ field: "montant", message: "Le montant doit avoir une valeur positive!" });
        }
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }



        let reste = await this.getRestePaiement(paiement.facture);
        console.log(reste, "restee");
        if (reste != 0) {

            session.startTransaction();  // Démarrer la transaction
            let is_completed = false;
            if (paiement.montant_payer >= reste) {
                is_completed = true;
                paiement.montant_payer = paiement.montant_payer - reste; // Déduit `reste` si nécessaire
            }

            await paiement.save({ session });

            if (is_completed) {
                const temp_facture = await Facture.findOne({ _id: paiement.facture });
                if (temp_facture) {
                    temp_facture.etat = 1; // Marquer la facture comme payée
                    await temp_facture.save({ session });
                }
            }
            await session.commitTransaction();

            // Terminer la session
            session.endSession();
        }



    } catch (error) {
        // console.error(error);
        await session.abortTransaction();
        session.endSession();  // Terminer la session

        if (error.errors) {
            // Renvoyer les erreurs de validation
            throw { message: error.message, errors: error.errors };
        } else {
            // Gestion d'autres erreurs imprévues
            throw new Error("Une erreur interne s'est produite");
        }
    }
};
exports.getRestePaiement = async (id_facture) => {
    try {
        // const facture=new Facture();
        const paiementDu = await Facture.findOne({ _id: id_facture })
            .select("montant_total")
            .exec();

        const paiementFait = await Paiement.aggregate([
            { $match: { facture: id_facture, etat: 0 } }, // Filtrer les documents
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant_payer" }
                }
            },
            {
                $project: {
                    _id: 0, // Supprimer l'identifiant
                    total: { $ifNull: ["$total", 0] } // Retourner 0 si total est null ou absent
                }
            }

        ]);
        console.log(paiementDu.montant_total, "<=du", paiementFait[0].total, "montant fait")
        if (paiementDu.montant_total <= paiementFait[0].total) {
            return 0;
        } else if (paiementFait.length == 0) {
            return paiementDu.montant_total;
        } else {
            return (paiementDu.montant_total - paiementFait[0].total);

        }
    } catch (error) {
        console.error(error);
    }
}
exports.read = async ({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' }) => {
    try {
        const query = search ? { paiement: { $regex: search, $options: 'i' } } : {};
        const sortOrder = orderBy === 'asc' ? 1 : -1;

        const paiementList = await Paiement
            .find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems = await Paiement.countDocuments(query);

        return {
            paiement: paiementList,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        };
    } catch (error) {
        console.error(error);
    }
}