const Produit = require('../models/Produit');

// enregistre un produit
exports.save = async (produitData) => {
    try {
        const produit = new Produit(produitData);
        if (!produit.nom_produit || !produit.unite) throw new Error("Le nom du produit et l'unité sont obligatoires !");

        if (await Produit.countDocuments({ nom_produit: produit.nom_produit.trim() }) < 1) {
            produit.nom_produit = produit.nom_produit.trim();
            produit.unite = produit.unite.trim();
            await produit.save();
        }else{
            throw new Error("Il y a déjà un produit portant ce nom");
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de produits avec pagination
exports.read = async (offset,limit) => {
    try {
        return await Produit.find().skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de produits avec pagination et filtre => condition "et"
exports.readBy = async (offset,limit,data) => {
    try {
        return await Produit.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne un produit a partir de son id
exports.readById = async (id) => {
    try {
        return await Produit.findOne({_id:id});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async(data)=>{
    try {
        const produit = new Produit(data);
        const initial_produit = await Produit.findOne({ _id:produit._id });
        
        initial_produit.nom_produit =produit.nom_produit; // Mise à jour de l'attribut
        initial_produit.unite=produit.unite;
        await initial_produit.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//supprime un produit a partir de l'id
exports.delete=async(id)=>{
    try {
        const produitSupprime = await Produit.findByIdAndDelete(id);
        console.log(produitSupprime); // Affiche le produit supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}