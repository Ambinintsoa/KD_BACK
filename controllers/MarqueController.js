const MarqueService=require("../services/MarqueService");

exports.save = async(req,res)=>{
    try {
        await MarqueService.save(req.body);
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
        let marques=await MarqueService.read(offset,limit);

        res.status(200).json({ marques:marques });
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
        let marques=await MarqueService.readBy(offset,limit,req.body);

        res.status(200).json({ marques:marques });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let marque=await MarqueService.readById(req.params.id);

        res.status(200).json({ marque:marque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await MarqueService.update(req.body);
        res.status(200).json({ message: "Marque modifiée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await MarqueService.delete(req.params.id);
        res.status(200).json({ message: " Marque effacée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


