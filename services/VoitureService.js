const Voiture = require('../models/Voiture');

// enregistre un voiture
exports.save = async (voitureData,objet_session) => {
    try {
        const voiture = new Voiture(voitureData);
        console.log(voitureData,voiture.immatriculation,voiture.marque ,voiture.categorie ,voiture.client,"check");
        if (!voiture.immatriculation || !voiture.marque || !voiture.categorie || !voiture.client) throw new Error("Le numero d'immatriculation,la marque et categorie de la voiture sont obligatoires !");


        if (await Voiture.countDocuments({ immatriculation: voiture.immatriculation.trim() }) < 1) {
            voiture.immatriculation = voiture.immatriculation.trim();
            // voiture.marque = voiture.marque.trim();
            // voiture.modele = voiture.modele.trim();
            // voiture.categorie = voiture.categorie.trim();

            await voiture.save(objet_session);
            return voiture;
        } else {
            return voiture;
            throw new Error("Il y a déjà une voiture portant ce numéro d'immatriculation");
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de voitures avec pagination
exports.read = async (offset, limit) => {
    try {
        return await Voiture.find().skip(offset).limit(limit).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de voitures avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
    try {
        return await Voiture.find(data).skip(offset).limit(limit).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne un voiture a partir de son id
exports.readById = async (id) => {
    try {
        return await Voiture.findOne({ _id: id }).populate("client");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
    try {
        const voiture = new Voiture(data);
        const initial_voiture = await Voiture.findOne({ _id: voiture._id });
        if (!initial_voiture) throw new Error("Aucune voiture correspondante !");
       
        if (initial_voiture.kilometrage && initial_voiture.kilometrage < 0) throw new Error("Le kilometrage doit avoir une valeur positive !");

        initial_voiture.immatriculation = (voiture.immatriculation && voiture.immatriculation.trim()) || ''; // Mise à jour de l'attribut
        initial_voiture.marque = (voiture.marque && voiture.marque.trim()) || ''; // Mise à jour de l'attribut
        initial_voiture.modele = (voiture.modele && voiture.modele.trim()) || ''; // Mise à jour de l'attribut
        initial_voiture.kilometrage = (voiture.kilometrage || voiture.kilometrage === 0) ? voiture.kilometrage : initial_voiture.kilometrage; // Mise à jour de l'attribut
        initial_voiture.client = voiture.client || initial_voiture.client; // Mise à jour de l'attribut


        await initial_voiture.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//supprime un voiture a partir de l'id
exports.delete = async (id) => {
    try {
        const voitureSupprime = await Voiture.findByIdAndDelete(id);
        console.log(voitureSupprime); // Affiche le voiture supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}