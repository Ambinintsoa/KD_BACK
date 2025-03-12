const mongoose = require("mongoose");

const AvisClientSchema = new mongoose.Schema({
    score: { type: Number, required: true },
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    avis: { type: String, required: true },
    mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false }
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('AvisClient', AvisClientSchema);
