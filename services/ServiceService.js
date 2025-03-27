const Service = require('../models/Service');
const { Op } = require('sequelize');
// enregistre un service
exports.save = async (serviceData) => {
    try {
        const service = new Service(serviceData);
        if (!service.nom_service || !service.categorie_service) throw new Error("Le nom du service et la catégorie du service sont obligatoires !");

        if (await Service.countDocuments({ nom_service: service.nom_service.trim() }) < 1) {
            service.nom_service = service.nom_service.trim();
            await service.save();
        } else {
            throw new Error("Il y a déjà un service portant ce nom");
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de services avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder) => {
    try {
        const query = search
        ? { nom_service: { $regex: search, $options: "i" } } // Recherche insensible à la casse
        : {};
    
    const sortOption = {};
    sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
    if (page < 1) {
        page = 1;
    }
    
    const services = await Service.find(query)
        .collation({ locale: 'fr', strength: 2 })  // Collation pour tri insensible à la casse
        .sort(sortOption)
        .where('statut', 0)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('categorie_service', 'nom_categorie') 
        .set('strictPopulate', false); 
    
    const total = await Service.countDocuments(query);
    
    return { services, total };
    
    } catch (error) {
        console.log(error.message)
        throw new Error("Erreur lors de la récupération des services");
    }
};
// liste de services avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
    try {
        return await Service.find(data).skip(offset).limit(limit).populate("categorie_service");
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne un service a partir de son id
exports.readById = async (id) => {
    try {
        return await Service.findOne({ _id: id }).populate("categorie_service");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
    try {
        const service = new Service(data);
        console.log(service.nom_service);
        const initial_service = await Service.findOne({ _id: service._id });

        if (!initial_service) throw new Error("Aucun service correspondant !");
        
        if (service.prix && service.prix < 0) throw new Error("Le prix doit avoir une valeur positive !");
        if(service.statut){
            initial_service.statut = service.statut || initial_service.statut; 
        }else{
            initial_service.nom_service = (service.nom_service && service.nom_service.trim()) || ''; // Mise à jour de l'attribut
            initial_service.duree = (service.duree || service.duree === 0) ? service.duree : 0; // Mise à jour de l'attribut
            initial_service.prix = (service.prix || service.prix === 0) ? service.prix : 0; // Mise à jour de l'attribut
            initial_service.categorie_service = service.categorie_service._id || initial_service.categorie_service; // Mise à jour de l'attribut
        }
        await initial_service.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}

    exports.countDocuments = async (filter) => {
        try {
            const count = await Service.countDocuments(filter);
            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des documents :", error);
            throw new Error('Erreur lors du comptage des documents');
        }
    };