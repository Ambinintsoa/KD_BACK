const mongoose = require('mongoose');
const RendezVous = require('../models/RendezVous');
const Tache = require('../models/Tache');
const Utilisateur = require('../models/Utilisateur');
const Voiture = require('../models/Voiture');
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');
const VoitureService=require('./VoitureService');
const FactureService=require('./FactureService');

// Fonction pour sauvegarder un rendez-vous (rdv)
exports.save = async (rdv_data, objet_session) => {

    const error_field = [];
    try {
        const rdv = new RendezVous(rdv_data);

        // Vérification de la date
        if (rdv.date_heure_debut < new Date()) {
            error_field.push({ field: "date_heure_debut", message: "La date heure début doit être supérieure ou égale à maintenant !" });
        }
        // Vérification du client

        if (rdv.client && mongoose.Types.ObjectId.isValid(rdv.client)) {
            const client = await Utilisateur.findOne({ _id: rdv.client });
            if (!client) {
                error_field.push({ field: "client", message: "Client invalide!" });
            }
        }
        // Vérification de la voiture

        // if (rdv.voiture && mongoose.Types.ObjectId.isValid(rdv.voiture)) {
        //     const voiture = await Voiture.findOne({ _id: rdv.voiture });
        //     if (!voiture) {
        //         error_field.push({ field: "voiture", message: "Voiture invalide!" });
        //     }
        // }

        // Si la liste d'erreurs contient des erreurs, on les renvoie
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }
        // // Vérification des doublons
        const existingRdv = await RendezVous.findOne({ client: rdv.client, date_heure_debut: rdv.date_heure_debut });
        if (existingRdv) {
            return existingRdv;
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
    let client = '';
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Permission non accordé' });
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        client = decoded.userId;

    } catch (error) {
        throw error;
    }
    const { taches, voiture, devis_object, ...restData } = req.body.request_body;
    let otherData = { ...restData, client };
    
    // Vérifie que 'taches' est bien un tableau
    if (!Array.isArray(taches)) {
        throw new Error("'taches' doit être un tableau");
    }


    const session = await mongoose.startSession();  // Démarrer une session

    session.startTransaction();  // Démarrer la transaction

    try {
        voiture.client=client;
        const voiture_inserted = await VoitureService.save(voiture, { session });
        otherData = { ...otherData, voiture:voiture_inserted._id };

        // Enregistrer le rendez-vous dans la session
        const last_rdv = await exports.save(otherData, { session });

        let error_field = []; // Assurez-vous que error_field est défini
        let i = 1;
        let list = [];

        taches.map((tacheData) => {
            list.push(tacheData.service);
        });

        // Vérification des doublons
        const hasDuplicates = new Set(list).size !== list.length;

        if (hasDuplicates) {
            error_field.push({
                field: `service`,
                message: `Les services ne doivent pas contenir de doublons!`,
            });
        }

        // Créer des objets de tâches à insérer
        const taches_obj = await Promise.all(
            taches.map(async (tacheData) => {
                list.push(tacheData.service);
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

       //enregistrer un facture lier par le rendez_vous
        await FactureService.saveFacture(devis_object,client,last_rdv._id,session);

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
            // error.errors.concat(error_field);
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
        console.log("coucou");
        return await RendezVous.find({statut:1}).
            // skip(offset).
            // limit(limit).
            populate("client").
            populate("mecanicien").
            populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}

// liste de tous les rendez-vous suivant des conditions
exports.readBy = async (offset, limit, data) => {
    try {
        return await RendezVous.find(data).
            // skip(offset).
            // limit(limit).
            populate("client").
            populate("mecanicien").
            populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}
exports.readById = async (id) => {
    try {
        return await RendezVous.find({ _id: id }).
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
        if (!data.date_debut) {
            data.date_debut = new Date();
        }
        if (!data.date_fin) {
            let temp_date = new Date(data.date_debut);
            temp_date.setDate(temp_date.getDate() + 7); // Ajoute 7 jour
            data.date_fin = temp_date;
        }

        const searchConditions = {
            mecanicien: data.mecanicien,
            date_heure_debut: {
                $gte: new Date(data.date_debut), // Début de la plage
                $lte: new Date(data.date_fin)   // Fin de la plage
            },
        };

        return await RendezVous.find(searchConditions).sort({ date_heure_debut: 1 }).
            // skip(offset).
            // limit(limit).
            populate("client").
            populate("mecanicien").
            populate("voiture");
    } catch (error) {
        console.error(error);
        throw error;

    }
}
// liste de tous les rendez-vous par mecanicien entre deux dates
exports.readByStatus = async (offset, limit, data) => {
    try {
        // Construire la condition de recherche
        const searchConditions = {
            statut: data.statut
        };
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

exports.getMecanicienDisponible = async (offset, limit, data) => {
    let error_field = [];
    try {
        let newDateRendezVous = new Date(data.date_debut);
        let now = new Date();

        if (newDateRendezVous < now) {
            error_field.push({ field: "date_rendez_vous", message: "La nouvelle date de rendez-vous doit être supérieure ou égale à maintenant!" });
            // throw { message: "Validation failed", errors: error_field };

        }

        const { date_fin } = data; // Extraire la date de fin de l'entrée
        let condition;

        if (!date_fin) {

            condition = {
                statut: "Assigné", // Filtrer uniquement les rendez-vous assignés
                $and: [
                    { date_heure_debut: { $lte: newDateRendezVous } },
                    {
                        $or: [
                            { date_heure_fin: { $gte: newDateRendezVous } }, // Fin >= nouvelle date
                            { date_heure_fin: { $exists: false } }           // Fin est null ou absente
                        ]
                    }
                ]
            };
        } else {
            const newDateFinRendezVous = new Date(date_fin);
            if (newDateFinRendezVous <= newDateRendezVous) {
                error_field.push({ field: "date_fin_rendez_vous", message: "La fin du rendez-vous doit être après le debut maintenant!" });
            }
            condition = {
                statut: "Assigné",
                $or: [
                    {
                        $and: [
                            { date_heure_debut: { $lte: newDateRendezVous } },
                            {
                                $or: [
                                    { date_heure_fin: { $gte: newDateRendezVous } },
                                    { date_heure_fin: { $exists: false } } // Gère les `null` ou champs absents
                                ]
                            }
                        ]
                    },
                    {
                        $and: [
                            { date_heure_debut: { $lte: newDateFinRendezVous } },
                            {
                                $or: [
                                    { date_heure_fin: { $gte: newDateFinRendezVous } },
                                    { date_heure_fin: { $exists: false } } // Gère les `null` ou champs absents
                                ]
                            }
                        ]
                    }
                ]
            };
        }

        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }

        // Rechercher les rendez-vous en fonction de la condition
        const mecaniciens = await RendezVous.find(condition)
            .select("mecanicien")
            .populate("mecanicien");


        // Crée une liste des mécaniciens déjà pris
        let list_meca_pris = [];
        mecaniciens.forEach(meca => {
            if (meca.mecanicien) {
                list_meca_pris.push(meca.mecanicien._id); // On récupère l'id du mécanicien
            }
        });
        // Recherche des mécaniciens disponibles (qui ne sont pas dans list_meca_pris)
        let mecanicien_disponible = await Utilisateur.find({
            _id: { $nin: list_meca_pris }, role: "mecanicien"// $nin pour sélectionner les utilisateurs dont l'id n'est pas dans la liste
        }).skip(offset)
            .limit(limit);


        return mecanicien_disponible;

    } catch (error) {
        console.error(error);
        if (error.errors) {
            error.errors.concat(error_field);
            throw { message: error.message, errors: error.errors };
        } else {

            throw error;
        }
    }
}

exports.updateRDV = async (data) => {
    const error_field = [];
    try {
        console.log(data);
        const rdv = new RendezVous(data);
        console.log(rdv);
        if (!rdv._id) {
            error_field.push({ field: "id", message: "Veuiller fournir un Id pour le rendez vous!" });
            // throw { message: error.message, errors: error.errors };

        }

        const rdv_initial = await RendezVous.findOne({ _id: rdv._id });
        if (!rdv_initial) {
            error_field.push({ field: "id", message: "Veuiller fournir un Id valide pour le rendez vous!" });
            // throw { message: error.message, errors: error.errors };
        }
        if (rdv.date_heure_fin) {
            if (rdv.date_heure_debut >= rdv.date_heure_fin) {
                error_field.push({ field: "date_heure_fin", message: "La date de debut doit être avant la date fin!" });
            }
        }
        if (rdv.montant_total && rdv.montant_total < 0) {
            error_field.push({ field: "montant_total", message: "Le montant total doit etre une valeur positive!" });
        }

        // Vérification du client
        if (rdv.client && mongoose.Types.ObjectId.isValid(rdv.client)) {
            const client = await Utilisateur.findOne({ _id: rdv.client });
            if (!client) {
                error_field.push({ field: "client", message: "Client invalide!" });
            }
        }

        // Vérification du mecanicien
        if (rdv.mecanicien && mongoose.Types.ObjectId.isValid(rdv.mecanicien)) {
            const mecanicien = await Utilisateur.findOne({ _id: rdv.mecanicien });
            if (!mecanicien) {
                error_field.push({ field: "mecanicien", message: "Mecanicien invalide!" });
            }
        }
        // Vérification de la voiture
        if (rdv.voiture && mongoose.Types.ObjectId.isValid(rdv.voiture)) {
            const voiture = await Voiture.findOne({ _id: rdv.voiture });
            if (!voiture) {
                error_field.push({ field: "voiture", message: "Voiture invalide!" });
            }
        }

        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }


        rdv_initial.date_heure_debut = (rdv.date_heure_debut) || rdv_initial.date_heure_debut;
        rdv_initial.date_heure_fin = (rdv.date_heure_fin) || rdv_initial.date_heure_fin;
        rdv_initial.client = (rdv.client) || rdv_initial.client;
        rdv_initial.voiture = (rdv.voiture) || rdv_initial.voiture;
        rdv_initial.mecanicien = (rdv.mecanicien) || rdv_initial.mecanicien;
        rdv_initial.montant_total = (rdv.montant_total) || rdv_initial.montant_total;
        rdv_initial.statut = (rdv.statut) || rdv_initial.statut;
        rdv_initial.etat = (rdv.etat) || rdv_initial.etat;

        await rdv_initial.save();

    } catch (error) {
        console.error(error);
        if (error.errors) {
            error.errors.concat(error_field);
            throw { message: error.message, errors: error.errors };
        } else {
            throw error;
        }
    }
}