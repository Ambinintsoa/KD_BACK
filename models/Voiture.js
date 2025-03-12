const mongoose = require("mongoose");

const VoitureSchema = new mongoose.Schema({
    immatriculation: { type: String, required: true },
    kilometrage: { type: Number, required: false },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Voiture', VoitureSchema);
