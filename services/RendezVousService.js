const mongoose = require('mongoose');
const RendezVous = require('../models/RendezVous'); 
const Tache = require('../models/Tache'); 
const Client = require('../models/Utilisateur'); 
const Voiture = require('../models/Voiture'); 
const Service= require('../models/Service');

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
        const client = await Client.findOne({ _id: rdv.client });
        if (!client) {
            error_field.push({ field: "client", message: "Client invalide !" });
        }

        // Vérification de la voiture (si elle existe)
        if (rdv.voiture) {
            const voiture = await Voiture.findOne({ immatriculation: rdv_data.immatriculation });
            if (!voiture) {
                error_field.push({ field: "voiture", message: "Voiture invalide !" });
            }
        }

        // Vérification des doublons
        const existingRdv = await RendezVous.findOne({ client: rdv.client, date_heure_debut: rdv.date_heure_debut });
        if (existingRdv) {
            error_field.push({ field: "rendezvous", message: "Rendez-vous déjà enregistré !" });
        }

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
    const error_field=[];
    const { taches, ...otherData } = req.body;

    // Vérifie que 'taches' est bien un tableau
    if (!Array.isArray(taches)) {
        throw new Error("'taches' doit être un tableau" );
    }

    const session = await mongoose.startSession();  // Démarrer une session

    session.startTransaction();  // Démarrer la transaction

    try {
        // Enregistrer le rendez-vous dans la session
        const last_rdv = await exports.save(otherData, { session });
        let i=1;
        
        // Créer des objets de tâches à insérer
        const taches_obj = taches.map(async tacheData => {
            if (!mongoose.Types.ObjectId.isValid(tacheData.service)) {
                console.log("L'ID du service n'est pas valide.");
                error_field.push({field:`service${i}`,message:`L'ID du service  n'est pas valide.`});

            } else {
                const service = await Service.findOne({ _id: mongoose.Types.ObjectId(tacheData.service) });
                if( !service){
                    error_field.push({field:`service${i}`,message:`Le service numero ${i} est invalide`});
                }    
             }
             i=i+1;
            
            });

            if (error_field.length > 0) {
                throw { message: "Validation failed", errors: error_field };
            }
        // Sauvegarder toutes les tâches en parallèle dans la session
        await Promise.all(
            taches_obj.map(tache => tache.save({ session }))  // Sauvegarde chaque tâche dans la session
        );

        
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
