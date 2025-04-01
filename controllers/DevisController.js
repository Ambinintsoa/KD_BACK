const DevisService=require("../services/DevisService");

exports.getDevis = async(req,res)=>{
    try {
        if (!req.body.liste_service || !req.body.voiture_data) {
            return res.status(400).json({ success: false, message: "Données manquantes" });
        }
        let {ligne_devis, total_devis}= DevisService.Calculate(req.body.liste_service,req.body.voiture_data);
        res.status(200).json({
            success: true,
            message: "Devis généré avec succès",
            data: {
                devis_details: ligne_devis,
                total_devis: total_devis
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}