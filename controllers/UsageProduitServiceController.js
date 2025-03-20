const UsageProduitServiceService=require("../services/UsageProduitServiceService");

exports.save = async(req,res)=>{
    try {
        await UsageProduitServiceService.save(req.body);
        res.status(201).json({ message: "Insertion réussie" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.read = async(req,res)=>{
    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        let usage_produit_services=await UsageProduitServiceService.read(offset,limit);

        res.status(200).json({ usage_produit_services:usage_produit_services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readBy = async(req,res)=>{
    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        let usage_produit_services=await UsageProduitServiceService.readBy(offset,limit,req.body);

        res.status(200).json({ usage_produit_services:usage_produit_services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let usage_produit_service=await UsageProduitServiceService.readById(req.params.id);

        res.status(200).json({ usage_produit_service:usage_produit_service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await UsageProduitServiceService.update(req.body);
        res.status(200).json({ message: "UsageProduitService modifiée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await UsageProduitServiceService.delete(req.params.id);
        res.status(200).json({ message: " UsageProduitService effacée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


