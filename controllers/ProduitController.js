const ProduitService= require("../services/ProduitService");

exports.save = async(req,res)=>{
    try {
        await ProduitService.saveProduit(req.body);
        res.status(201).json({ message: "Insertion réussie" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


