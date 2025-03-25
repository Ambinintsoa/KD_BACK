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
