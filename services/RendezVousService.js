const mongoose = require('mongoose');
const RendezVous = require('../models/RendezVous'); // Assurez-vous que le modèle est bien importé
const Tache = require('../models/Tache'); // Assurez-vous que le modèle est bien importé
const Client = require('../models/Utilisateur'); // Assurez-vous que le modèle est bien importé
const Voiture = require('../models/Voiture'); // Assurez-vous que le modèle est bien importé

// Fonction pour sauvegarder un rendez-vous (rdv)
exports.save = async (rdv_data, objet_session) => {
    try {
        const rdv = new RendezVous(rdv_data);

        // Vérification de la date
        if (rdv.date_heure_debut < new Date()) throw new Error("La date doit être supérieure ou égale à maintenant  !");

        // Vérification du client
        if (!await Client.findOne({ _id: rdv.client })) throw new Error("Client invalide !");

        // Vérification de la voiture (si elle existe)
        if (rdv.voiture) {
            if (!await Voiture.findOne({ _id: rdv.voiture })) throw new Error("Voiture invalide !");
        }

        // Sauvegarder le rendez-vous dans la session
        await rdv.save(objet_session);  // Passer la session pour que la transaction soit gérée correctement
        return rdv;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Fonction pour sauvegarder le rendez-vous et les tâches associées
exports.saveRDV = async (req, res) => {
    const { taches, ...otherData } = req.body;

    // Vérifie que 'taches' est bien un tableau
    if (!Array.isArray(taches)) {
        return res.status(400).json({ error: "'taches' doit être un tableau" });
    }

    const session = await mongoose.startSession();  // Démarrer une session

    session.startTransaction();  // Démarrer la transaction

    try {
        // Enregistrer le rendez-vous dans la session
        const last_rdv = await exports.save(otherData, { session });

        // Créer des objets de tâches à insérer
        const taches_obj = taches.map(tacheData => {
            let temp_tache = new Tache(tacheData);
            temp_tache.rendez_vous = last_rdv;  // Associer la tâche au rendez-vous
            return temp_tache;
        });

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
        throw error;

       
    }
};
