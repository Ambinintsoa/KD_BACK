const mongoose = require("mongoose");

const RendezVousSchema = new mongoose.Schema({
    date_heure_debut: { type: Date, required: true },
    date_heure_fin: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false },
    voiture: { type: mongoose.Schema.Types.ObjectId, ref: "Voiture", required: false },
    montant_total: { type: Number, required: false },
    statut: { type: String, required: true},
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Facture', RendezVousSchema);
