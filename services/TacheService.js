const mongoose = require("mongoose");

const Tache = require('../models/Tache');

// liste de taches avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, idRDV) => {
    try {
        return await Tache.find({"rendez_vous":idRDV}).skip(offset).limit(limit).populate("service");
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.update_Tache= async (data) => {
    try {
        if (data.id  && mongoose.Types.ObjectId.isValid(data.id)) {
            const tache = await Tache.findOne({ _id: data.id });
            if (!tache) {
                error_field.push({ field: "tache", message: "Il faut fournir le mecanicien"});
            }
            tache.statut=data.statut;
             await tache.save();
        } else {
            error_field.push({ field: "tache", message: "ID de tache invalide!" });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}