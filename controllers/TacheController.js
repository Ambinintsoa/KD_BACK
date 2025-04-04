
const TacheService = require("../services/TacheService");
exports.update = async (req, res) => {

    try {
        console.log("req.body",req.body);
        await TacheService.update_Tache(req.body);
        
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
exports.readBy= async (req, res) => {

    try {
       
        // Vérifier si l'ID de rendez-vous est fourni
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        console.log(req.params.idRDV,"hey");
        let taches= await TacheService.readBy(offset,limit,idRDV=req.params.idRDV);
        console.log("taches",taches);
        res.status(200).json({ taches });

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