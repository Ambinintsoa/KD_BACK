const Tache = require('../models/Tache');

// liste de taches avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
    try {
        return await Tache.find(data).skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.update_statut= async (data) => {
    try {
        if (data.id  && mongoose.Types.ObjectId.isValid(data.id)) {
            const tache = await Tache.findOne({ _id: data.id });
            if (!tache) {
                error_field.push({ field: "tache", message: "Il faut fournir le mecanicien"});
            }
            tache.statut=data.statut;
        } else {
            error_field.push({ field: "tache", message: "ID de tache invalide!" });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}