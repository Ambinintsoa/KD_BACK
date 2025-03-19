const AvisClient = require('../models/AvisClient');

// enregistre une avis_client
exports.save = async (avis_clientData) => {
    try {
        const avis_client = new AvisClient(avis_clientData);
        if (!avis_client.client || !avis_client.score|| !avis_client.avis) throw new Error("L'utilisateur, le score et l\'avis sont obligatoires !");

        if(! await AvisClient.findOne({_id:avis_client.client})) throw new Error("L'utilisateur n'existe pas!");
        
        if(!avis_client.mecanicien){
            if(! await AvisClient.findOne({_id:avis_client.mecanicien})) throw new Error("Le mecanicien n'existe pas!");  
        }

        if(! await AvisClient.findOne({_id:avis_client.client})) throw new Error("L'utilisateur n'existe pas!");
       
        avis_client.avis = avis_client.avis.trim();
        await avis_client.save();
       
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de avis_clients avec pagination
exports.read = async (offset,limit) => {
    try {
        return await AvisClient.find().skip(offset).limit(limit).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de avis_clients avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await AvisClient.find(data).skip(offset).limit(limit).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de avis_clients avec pagination trier par score dans un ordre decroissant "
exports.readByScoreDESC  = async (offset,limit,value) => {
    try {
        return await AvisClient.find({score:{$gte:value}}).sort({age:-1}).skip(offset).limit(limit);// -1 pour décroissant
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//retourne une avis_client a partir de son id
exports.readById = async (id) => {
    try {
        return await AvisClient.findOne({_id:id}).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}


//supprime une avis_client a partir de l'id
exports.delete=async(id)=>{
    try {
        const avis_clientSupprime = await AvisClient.findByIdAndDelete(id);
        console.log(avis_clientSupprime); // Affiche le avis_client supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}