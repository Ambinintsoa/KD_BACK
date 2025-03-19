const CategorieService = require('../models/CategorieService');

// enregistre une categorie
exports.save = async (categorieData) => {
    try {
        const categorie = new CategorieService(categorieData);
        if (!categorie.nom_categorie ) throw new Error("Le nom du categorie est obligatoire !");

        if (await CategorieService.countDocuments({ nom_categorie: categorie.nom_categorie.trim() }) < 1) {
            categorie.nom_categorie = categorie.nom_categorie.trim();
            await categorie.save();
        }else{
            throw new Error("Il y a déjà une categorie portant ce nom");
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de categories avec pagination
exports.read = async (offset,limit) => {
    try {
        return await CategorieService.find().skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de categories avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await CategorieService.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne une categorie a partir de son id
exports.readById = async (id) => {
    try {
        return await CategorieService.findOne({_id:id});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async(data)=>{
    try {
        const categorie = new CategorieService(data);
        const initial_categorie = await CategorieService.findOne({ _id:categorie._id });
        if(! initial_categorie) throw new Error("Aucun categorie correspondant !");

        initial_categorie.nom_categorie = (categorie.nom_categorie && categorie.nom_categorie.trim()) || ''; // Mise à jour de l'attribut

       
        await initial_categorie.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//supprime une categorie a partir de l'id
exports.delete=async(id)=>{
    try {
        const categorieSupprime = await CategorieService.findByIdAndDelete(id);
        console.log(categorieSupprime); // Affiche le categorie supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}