const AvisClientService=require("../services/AvisClientService");
exports.save = async(req,res)=>{
    try {
        await AvisClientService.save(req.body);
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
        let avisclients=await AvisClientService.read(offset,limit);

        res.status(200).json({ avisclients:avisclients });
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
        let avisclients=await AvisClientService.readBy(offset,limit,req.body);

        res.status(200).json({ avisclients:avisclients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
// liste des avis des clients ayant des score plus grans que 5
exports.readByScoreDESC = async(req,res)=>{
    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        let avisclients=await AvisClientService.readByScoreDESC(offset,limit,5);//plus grand que 5

        res.status(200).json({ avisclients:avisclients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.readById = async(req,res)=>{
    try {
        let avisclient=await AvisClientService.readById(req.params.id);

        res.status(200).json({ avisclient:avisclient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.delete = async(req,res)=>{
    try {
        await AvisClientService.delete(req.params.id);
        res.status(200).json({ message: " L' Avis Client effacé avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
// modifie le statut
exports.updateStatut = async(req,res)=>{
    try {
        await AvisClientService.updateStatut(req.params.id,req.params.statut);
        res.status(200).json({ message: " Le statut de l' Avis Client est modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readByRandom = async(req,res)=>{
    try {
        let limit=req.params.limit;
        const resultat=await AvisClientService.readRandom(limit);
        res.status(200).json({ avis_clients: resultat });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


