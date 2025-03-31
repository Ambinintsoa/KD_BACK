const UsageProduitService = require('../models/UsageProduitService');
const Service = require('../models/Service');
const Produit = require('../models/Produit');
// enregistre un usage_produit_service
exports.save = async (usage_produit_serviceData) => {
    try {
        const usage_produit_service = new UsageProduitService(usage_produit_serviceData);
        if (!usage_produit_service.service || !usage_produit_service.produit || !usage_produit_service.quantite) throw new Error("Le service et le produit ainsi que la quantite  sont obligatoires !");
        
        if(usage_produit_service.quantite <=0 ) throw new Error("La quantité doit être positive!");

        if (! await Service.findOne({ _id: usage_produit_service.service })) throw new Error("Le service n'existe pas!");
        
        if (! await Produit.findOne({ _id: usage_produit_service.produit})) throw new Error("Le produit n'existe pas!");

        await usage_produit_service.save();

    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de usage_produit_services avec pagination
exports.read = async (offset, limit) => {
    try {
        return await UsageProduitService.find()
                    .skip(offset)       // Pour la pagination, en sautant les premiers `offset` documents
                    .limit(limit)       // Limiter le nombre de résultats retournés à `limit`
                    .populate("service") // Peupler le champ `service`
                    .populate("produit"); // Peupler le champ `produit`
    } catch (error) {
        console.error(error);
        throw error;
    }
}
// liste de usage_produit_services avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
    try {
        return await UsageProduitService.find(data)
                                    .skip(offset)
                                    .limit(limit)
                                    .populate("service") // Peupler le champ `service`
                                    .populate("produit"); // Peupler le champ `produit`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//retourne un usage_produit_service a partir de son id
exports.readById = async (id) => {
    try {
        return await UsageProduitService.findOne({ _id: id }).populate("service").populate("produit");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
    try {
        const usage_produit_service = new UsageProduitService(data);
        if (!usage_produit_service.service || !usage_produit_service.produit || !usage_produit_service.quantite || !usage_produit_service._id) throw new Error("Le service et le produit ainsi que la quantite  sont obligatoires !");

        const initial_usage_produit_service = await UsageProduitService.findOne({ _id: usage_produit_service._id });

        if (!initial_usage_produit_service) throw new Error("Aucun usage_produit_service correspondant !");

        if(usage_produit_service.quantite <=0 ) throw new Error("La quantité doit être positive!");

        if (! await Service.findOne({ _id: usage_produit_service.service })) throw new Error("Le service n'existe pas!");
        
        if (! await Produit.findOne({ _id: usage_produit_service.produit})) throw new Error("Le produit n'existe pas!");


        initial_usage_produit_service.service = (usage_produit_service.service) || initial_usage_produit_service.service; // Mise à jour de l'attribut
        initial_usage_produit_service.produit = (usage_produit_service.produit) || initial_usage_produit_service.produit; // Mise à jour de l'attribut
        initial_usage_produit_service.quantite = (usage_produit_service.quantite || usage_produit_service.quantite==0) ? initial_usage_produit_service.quantite:0; // Mise à jour de l'attribut

        await initial_usage_produit_service.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
//supprime un usage_produit_service a partir de l'id
exports.delete = async (id) => {
    try {
        const usage_produit_serviceSupprime = await UsageProduitService.findByIdAndDelete(id);
        console.log(usage_produit_serviceSupprime); // Affiche le usage_produit_service supprimé
    } catch (error) {
        console.error(error);
        throw error;
    }
}