const VoitureService= require("../services/VoitureService");

exports.save = async(req,res)=>{
    try {
        await VoitureService.save(req.body);
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
        let voitures=await VoitureService.read(offset,limit);

        res.status(200).json({ voitures:voitures });
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
        let voitures=await VoitureService.readBy(offset,limit,req.body);

        res.status(200).json({ voitures:voitures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let voiture=await VoitureService.readById(req.params.id);

        res.status(200).json({ voiture:voiture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await VoitureService.update(req.body);
        res.status(200).json({ message: "Voiture modifiée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await VoitureService.delete(req.params.id);
        res.status(200).json({ message: " Voiture effacée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


