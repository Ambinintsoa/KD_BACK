const CategorieVoiture = require('../models/CategorieVoiture');

const { Op } = require('sequelize');
// enregistre une categorie_voiture
exports.save = async (categorie_voitureData) => {
    try {
        const categorie_voiture = new CategorieVoiture(categorie_voitureData);
        if (!categorie_voiture.nom ) throw new Error("Le nom du categorie_voiture est obligatoire !");

        if (await CategorieVoiture.countDocuments({ nom: categorie_voiture.nom.trim() }) < 1) {
            categorie_voiture.nom = categorie_voiture.nom.trim();
            await categorie_voiture.save();
        }else{
            throw new Error("Il y a déjà une categorie_voiture portant ce nom");
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de categorie_voitures 
exports.getAll = async (query = {}, sortOption = { nom: 1 }) => {
    try {
        // Récupération des catégories avec collation, tri par nom croissant (ASC)
        const categorie_voitures = await CategorieVoiture.find(query)
            .collation({ locale: 'fr', strength: 2 })
            .sort(sortOption); // Tri par nom ascendant

        // Comptage des documents (total)
        const total = await CategorieVoiture.countDocuments(query);

        // Retourner les catégories et le total
        return { categorie_voitures, total };
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories : ", error.message);
        throw new Error("Erreur lors de la récupération des catégories");
    }
};

// liste de categorie_voitures avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder, filters={}) => {
    try {
        const query = search
            ? { nom: { $regex: search, $options: "i" } } // Recherche insensible à la casse
            : {};

        const sortOption = {};
        sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
        if (page < 1) {
            page = 1;
        }
        const categories = await CategorieVoiture.find(query)
        .collation({ locale: 'fr', strength: 2 })
            .sort(sortOption)
            .where('statut',1)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await CategorieVoiture.countDocuments(query);

        return { categories, total };
    } catch (error) {
        throw new Error("Erreur lors de la récupération des catégories");
    }
};
// liste de categorie_voitures avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await CategorieVoiture.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne une categorie_voiture a partir de son id
exports.readById = async (id) => {
    try {
        return await CategorieVoiture.findOne({_id:id});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async(data)=>{
    try {
        const categorie_voiture = new CategorieVoiture(data);
        const initial_categorie_voiture = await CategorieVoiture.findOne({ _id:categorie_voiture._id });
        if(! initial_categorie_voiture) throw new Error("Aucun categorie_voiture correspondant !");
        if(categorie_voiture.nom){
            initial_categorie_voiture.nom = (categorie_voiture.nom && categorie_voiture.nom.trim()) || initial_categorie_voiture.nom; // Mise à jour de l'attribut
        }
       if(categorie_voiture.statut){
        initial_categorie_voiture.statut = categorie_voiture.statut  || initial_categorie_voiture.statut; // Mise à jour de l'attribut
       }
        await initial_categorie_voiture.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}

    exports.countDocuments = async (filter) => {
        try {
            const count = await CategorieVoiture.countDocuments(filter);
            return count;
        } catch (error) {
            console.error("Erreur lors du comptage des documents :", error);
            throw new Error('Erreur lors du comptage des documents');
        }
    };

    