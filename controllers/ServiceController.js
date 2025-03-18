const ServiceService= require("../services/ServiceService");

exports.save = async(req,res)=>{
    try {
        await ServiceService.save(req.body);
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
        let services=await ServiceService.read(offset,limit);

        res.status(200).json({ services:services });
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
        let services=await ServiceService.readBy(offset,limit,req.body);

        res.status(200).json({ services:services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let service=await ServiceService.readById(req.params.id);

        res.status(200).json({ service:service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        await ServiceService.update(req.body);
        res.status(200).json({ message: "Service modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await ServiceService.delete(req.params.id);
        res.status(200).json({ message: " Service effacé avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


