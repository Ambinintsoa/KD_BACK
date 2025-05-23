const RendezVousService = require("../services/RendezVousService");


exports.saveRDV = async (req, res) => {

    try {
        await RendezVousService.saveRDV(req);
        
        res.status(201).json({ message: "Insertion réussie" });
    } catch (error) {
       
        console.error(error);
        if (error.errors) {
            // Renvoyer les erreurs de validation
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        // Renvoyer une erreur générique
        res.status(500).json({ message: "Une erreur interne est survenue" })
    }
};
exports.update = async (req, res) => {

    try {
        await RendezVousService.updateRDV(req.body);
        
        res.status(201).json({ message: "Modification réussie" });
    } catch (error) {
       
        console.error(error);
        if (error.errors) {
            // Renvoyer les erreurs de validation
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        // Renvoyer une erreur générique
        res.status(500).json({ message: "Une erreur interne est survenue" })
    }
};

exports.assignRDV = async (req, res) => {

    try {
        console.log(req.body);
        await RendezVousService.assignRDV(req.body);
        
        res.status(201).json({ message: "Assignation réussie" });
    } catch (error) {
       
        console.error(error);
        if (error.errors) {
            // Renvoyer les erreurs de validation
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        // Renvoyer une erreur générique
        res.status(500).json({ message: "Une erreur interne est survenue" })
    }
};
exports.read = async (req, res) => {

    try {
        let page= 1;
        let limit=10;
        const offset = (page - 1) * limit;
        const rendezvous=await RendezVousService.read(offset,limit);

        res.status(200).json({ rendezvous:rendezvous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.readBy = async (req, res) => {

    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        const rendezvous=await RendezVousService.readBy(offset,limit,req.body);

        res.status(200).json({ rendezvous:rendezvous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.readById = async (req, res) => {

    try {
        
        const rendezvous=await RendezVousService.readById(req.params.id);

        res.status(200).json({ rendezvous:rendezvous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.readByMecanicien = async (req, res) => {

    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        const rendezvous=await RendezVousService.readByMecanicien(offset,limit,req.body);

        res.status(200).json({ rendezvous:rendezvous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.readByStatus = async (req, res) => {

    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        const rendezvous=await RendezVousService.readByStatus(offset,limit,req.body);

        res.status(200).json({ rendezvous:rendezvous });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getMecanicienDisponible = async (req, res) => {

    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        const mecaniciens=await RendezVousService.getMecanicienDisponible(offset,limit,req.body);

        res.status(200).json({ mecaniciens:mecaniciens });
    } catch (error) {
        console.error(error);
        if (error.errors) {
            // Renvoyer les erreurs de validation
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        // Renvoyer une erreur générique
        res.status(500).json({ message: "Une erreur interne est survenue" })
    }
};