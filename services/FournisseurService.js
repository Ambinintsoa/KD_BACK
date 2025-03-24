const Fournisseur = require('../models/Fournisseur');

// enregistre une fournisseur
exports.save = async (fournisseurData) => {
    try {
        const fournisseur = new Fournisseur(fournisseurData);
        if (!fournisseur.nom_fournisseur ) throw new Error("Le nom du fournisseur est obligatoire !");

        if (await Fournisseur.countDocuments({ nom_fournisseur: fournisseur.nom_fournisseur.trim() }) < 1) {
            fournisseur.nom_fournisseur = fournisseur.nom_fournisseur.trim();
            await fournisseur.save();
        }else{
            throw new Error("Il y a déjà un fournisseur portant ce nom");
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de fournisseurs avec pagination
exports.read = async (offset,limit) => {
    try {
        return await Fournisseur.find().skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de fournisseurs avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await Fournisseur.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne une fournisseur a partir de son id
exports.readById = async (id) => {
    try {
        return await Fournisseur.findOne({_id:id});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async(data)=>{
    try {
        const fournisseur = new Fournisseur(data);
        const initial_fournisseur = await Fournisseur.findOne({ _id:fournisseur._id });
        if(! initial_fournisseur) throw new Error("Aucun fournisseur correspondant !");

        initial_fournisseur.nom_fournisseur = (fournisseur.nom_fournisseur && fournisseur.nom_fournisseur.trim()) || initial_fournisseur.nom_fournisseur; // Mise à jour de l'attribut
        initial_fournisseur.image = (fournisseur.image && fournisseur.image.trim()) || initial_fournisseur.image; // Mise à jour de l'attribut
        initial_fournisseur.contact = (fournisseur.contact && fournisseur.contact.trim()) || initial_fournisseur.contact; // Mise à jour de l'attribut
        initial_fournisseur.email = (fournisseur.email && fournisseur.email.trim()) || initial_fournisseur.email; // Mise à jour de l'attribut
        initial_fournisseur.statut = fournisseur.statut ||initial_fournisseur.statut ; // Mise à jour de l'attribut

       
        await initial_fournisseur.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//supprime un fournisseur a partir de l'id
exports.delete=async(id)=>{
    try {
        const fournisseurSupprime = await Fournisseur.findByIdAndDelete(id);
        console.log(fournisseurSupprime); // Affiche le fournisseur supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}