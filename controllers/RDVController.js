const RendezVousService = require("../services/RendezVousService");


exports.saveRDV = async (req, res) => {

    try {
        await RendezVousService.saveRDV(req);
        
        res.status(201).json({ message: "Insertion réussie" });
    } catch (error) {
       
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
