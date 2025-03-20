const FournisseurService=require("../services/FournisseurService");

exports.save = async(req,res)=>{
    try {
        await FournisseurService.save(req.body);
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
        let fournisseurs=await FournisseurService.read(offset,limit);

        res.status(200).json({ fournisseurs:fournisseurs });
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
        let fournisseurs=await FournisseurService.readBy(offset,limit,req.body);

        res.status(200).json({ fournisseurs:fournisseurs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let fournisseur=await FournisseurService.readById(req.params.id);

        res.status(200).json({ fournisseur:fournisseur });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await FournisseurService.update(req.body);
        res.status(200).json({ message: "Fournisseur modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await FournisseurService.delete(req.params.id);
        res.status(200).json({ message: " Fournisseur effacé avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


