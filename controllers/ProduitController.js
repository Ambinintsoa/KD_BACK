const ProduitService= require("../services/ProduitService");

exports.save = async(req,res)=>{
    try {
        await ProduitService.save(req.body);
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
        let produits=await ProduitService.read(offset,limit);

        res.status(200).json({ produits:produits });
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
        let produits=await ProduitService.readBy(offset,limit,req.body);

        res.status(200).json({ produits:produits });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let produit=await ProduitService.readById(req.params.id);

        res.status(200).json({ produit:produit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await ProduitService.update(req.body);
        res.status(200).json({ message: "Produit modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await ProduitService.delete(req.params.id);
        res.status(200).json({ message: " Produit effacé avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


