const mongoose = require('mongoose');
const RendezVous = require('../models/RendezVous');
const Tache = require('../models/Tache');
const Utilisateur = require('../models/Utilisateur');
const Voiture = require('../models/Voiture');
const Service = require('../models/Service');

// Fonction pour sauvegarder un rendez-vous (rdv)
exports.save = async (rdv_data, objet_session) => {
    const error_field = [];
    try {
        const rdv = new RendezVous(rdv_data);
        console.log(rdv.date_heure_debut, " date heure debut");

        // Vérification de la date
        if (rdv.date_heure_debut < new Date()) {
            error_field.push({ field: "date_heure_debut", message: "La date heure début doit être supérieure ou égale à maintenant !" });
        }

        // Vérification du client
        const client = await Utilisateur.findOne({ _id: rdv.client });
        if (!client) {
            error_field.push({ field: "client", message: "Utilisateur invalide !" });
        }

        // Vérification de la voiture (si elle existe)
        if (rdv.voiture) {
            const voiture = await Voiture.findOne({ immatriculation: rdv_data.immatriculation });
            if (!voiture) {
                error_field.push({ field: "voiture", message: "Voiture invalide !" });
            }
        }

        // // Vérification des doublons
        // const existingRdv = await RendezVous.findOne({ client: rdv.client, date_heure_debut: rdv.date_heure_debut });
        // if (existingRdv) {
        //     error_field.push({ field: "rendezvous", message: "Rendez-vous déjà enregistré !" });
        // }

        // Si la liste d'erreurs contient des erreurs, on les renvoie
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }

        // Sauvegarder le rendez-vous dans la session
        await rdv.save(objet_session);
        return rdv;

    } catch (error) {
        console.error(error);
        if (error.errors) {
            // Renvoyer les erreurs de validation
            throw { message: error.message, errors: error.errors };
        } else {
            // Gestion d'autres erreurs imprévues
            throw new Error("Une erreur interne s'est produite");
        }
    }
};



// Fonction pour sauvegarder le rendez-vous et les tâches associées
exports.saveRDV = async (req) => {
    const error_field = [];
    const { taches, ...otherData } = req.body;

    // Vérifie que 'taches' est bien un tableau
    if (!Array.isArray(taches)) {
        throw new Error("'taches' doit être un tableau");
    }

    const session = await mongoose.startSession();  // Démarrer une session

    session.startTransaction();  // Démarrer la transaction

    try {
        // Enregistrer le rendez-vous dans la session
        const last_rdv = await exports.save(otherData, { session });
        let error_field = []; // Assurez-vous que error_field est défini
        let i = 1;

        // Créer des objets de tâches à insérer
        const taches_obj = await Promise.all(
            taches.map(async (tacheData) => {
                if (!mongoose.Types.ObjectId.isValid(tacheData.service)) {
                    error_field.push({
                        field: `service${i}`,
                        message: `L'ID du service numéro ${i} n'est pas valide.`,
                    });
                } else {
                    const service = await Service.findOne({
                        _id: new mongoose.Types.ObjectId(tacheData.service),
                    });
                    if (!service) {
                        error_field.push({
                            field: `service${i}`,
                            message: `Le service numéro ${i} est invalide.`,
                        });
                    }
                }

                const temp_tache = new Tache(tacheData);
                temp_tache.rendez_vous = last_rdv._id;
                i++; // Incrémenter l'indice après traitement

                return temp_tache;
            })
        );

        // Si des erreurs ont été détectées, lever une exception avant de continuer
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }

        // Sauvegarder toutes les tâches en parallèle dans la
        await Promise.all(
            taches_obj.map((tache) => tache.save({ session })) // Sauvegarde chaque tâche dans la session
        );

        await session.commitTransaction();

        // Terminer la session
        session.endSession();


    } catch (error) {
        // En cas d'erreur, rollback de la transaction
        await session.abortTransaction();
        session.endSession();  // Terminer la session

        console.error(error);
        if (error.errors) {
            error.errors.concat(error_field);
            throw { message: error.message, errors: error.errors };
        } else {
            // Gestion d'autres erreurs imprévues
            throw error;
        }


    }
};


// Fonction pour assigner le rendez-vous a un mecanicien
exports.assignRDV = async (data) => {
    const error_field = [];
    const session = await mongoose.startSession();  // Démarrer une session

    session.startTransaction();  // Démarrer la transaction

    try {
        // Enregistrer le rendez-vous dans la session
        if (!mongoose.Types.ObjectId.isValid(data.rdv)) {
            error_field.push({ field: `rendezvous`, message: `Le rendez vous est invalide` });
        }
        if (!mongoose.Types.ObjectId.isValid(data.mecanicien)) {
            error_field.push({ field: `mecanicien`, message: `Le mecanicien est invalide` });
        }
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }
        //verifie s'il y a un rdv portant ce id
        const initial_rdv = await RendezVous.findOne({ _id: data.rdv });
        if (!initial_rdv) {
            error_field.push({ field: `rendezvous`, message: `Le rendez vous est invalide` });
        }
        //verifie s'il y a un mecanicien portant ce id
        if (! await Utilisateur.findOne({ _id: data.mecanicien })) {
            error_field.push({ field: `mecanicien`, message: `Le mecanicien est invalide` });
        } else {
            //modifie le rdv : statut => assigné et nouveau ,mecanicien
            initial_rdv.mecanicien = data.mecanicien;
            initial_rdv.statut = "Assigné";
            await initial_rdv.save({ session });
        }

        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }

        // Si tout s'est bien passé, on commite la transaction
        await session.commitTransaction();

        // Terminer la session
        session.endSession();


    } catch (error) {
        // En cas d'erreur, rollback de la transaction
        await session.abortTransaction();
        session.endSession();  // Terminer la session

        console.error(error);
        if (error.errors) {
            error.errors.concat(error_field);
            throw { message: error.message, errors: error.errors };
        } else {
            // Gestion d'autres erreurs imprévues
            throw error;
        }


    }
};
// liste de tous les rendez-vous
exports.read = async (offset, limit) => {
    try {
        return await RendezVous.find().
                    skip(offset).
                    limit(limit).
                    populate("client").
                    populate("mecanicien").
                    populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}
// liste de tous les rendez-vous par mecanicien entre deux dates
exports.readByMecanicien = async (offset, limit, data) => {
    try {
        // console.log(new Date(data.date_debut),new Date(data.date_fin));
        if (!data.date_debut) {
            data.date_debut = new Date();
        }
        if (!data.date_fin) {
            let temp_date = new Date(data.date_debut); 
            temp_date.setDate(temp_date.getDate() + 7); // Ajoute 7 jour
            data.date_fin = temp_date;
        }
        // Construire la condition de recherche
        const searchConditions = {
            mecanicien: data.mecanicien,
            date_heure_debut: { 
                $gte: new Date(data.date_debut), // Début de la plage
                $lte: new Date(data.date_fin)   // Fin de la plage
            },
        };  
        
        return await RendezVous.find(searchConditions).sort({date_heure_debut:1}).
                    skip(offset).
                    limit(limit).
                    populate("client").
                    populate("mecanicien").
                    populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}
// liste de tous les rendez-vous par mecanicien entre deux dates
exports.readByStatus = async (offset, limit,data) => {
    try {
        // Construire la condition de recherche
        const searchConditions = {
            statut:data.statut
        };
        console.log(data);
        return await RendezVous.find(searchConditions).
                    skip(offset).
                    limit(limit).
                    populate("client").
                    populate("mecanicien").
                    populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}