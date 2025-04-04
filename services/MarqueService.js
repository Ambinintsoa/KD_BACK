const Marque = require('../models/Marque');
const ServiceService  = require('./ServiceService')
const { Op } = require('sequelize');
// enregistre une marque
exports.save = async (marqueData) => {
    try {
        const marque = new Marque(marqueData);
        if (!marque.nom_marque ) throw new Error("Le nom du marque est obligatoire !");

        if (await Marque.countDocuments({ nom_marque: marque.nom_marque.trim() }) < 1) {
            marque.nom_marque = marque.nom_marque.trim();
            await marque.save();
        }else{
            throw new Error("Il y a déjà une marque portant ce nom");
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de marques 
exports.getAll = async (query = {}, sortOption = { nom_marque: 1 }) => {
    try {
        // Récupération des catégories avec collation, tri par nom_marque croissant (ASC)
        const marques = await Marque.find(query)
            .collation({ locale: 'fr', strength: 2 })
            .sort(sortOption); // Tri par nom_marque ascendant

        // Comptage des documents (total)
        const total = await Marque.countDocuments(query);

        // Retourner les catégories et le total
        return { marques, total };
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories : ", error.message);
        throw new Error("Erreur lors de la récupération des catégories");
    }
};

// liste de marques avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder, filters={}) => {
    try {
        const query = search
            ? { nom_marque: { $regex: search, $options: "i" } } // Recherche insensible à la casse
            : {};

        const sortOption = {};
        sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
        if (page < 1) {
            page = 1;
        }
        const marques = await Marque.find(query)
        .collation({ locale: 'fr', strength: 2 })
            .sort(sortOption)
            .where('statut',1)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Marque.countDocuments(query);

        return { marques, total };
    } catch (error) {
        throw new Error("Erreur lors de la récupération des catégories");
    }
};
// liste de marques avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await Marque.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne une marque a partir de son id
exports.readById = async (id) => {
    try {
        return await Marque.findOne({_id:id});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async(data)=>{
    try {
        const marque = new Marque(data);
        const initial_marque = await Marque.findOne({ _id:marque._id });
        if(! initial_marque) throw new Error("Aucun marque correspondant !");
        if(marque.nom_marque){
            initial_marque.nom_marque = (marque.nom_marque && marque.nom_marque.trim()) || initial_marque.nom_marque; // Mise à jour de l'attribut
        }
       if(marque.statut){
        initial_marque.statut = marque.statut  || initial_marque.statut; // Mise à jour de l'attribut
       }
        await initial_marque.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}

    exports.countDocuments = async (filter) => {
        try {
            const count = await Marque.countDocuments(filter);
            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des documents :", error);
            throw new Error('Erreur lors du comptage des documents');
        }
    };

    