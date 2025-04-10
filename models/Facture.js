const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    rendez_vous:{type: mongoose.Schema.Types.ObjectId, ref: "RendezVous", required:false },
    montant_total: { type: Number, required: false },
    statut: { type: Number, required: true,default:0 }, // 0 : mbola tsy payer sy tsy mbola confirmer ny rdv // 1: confimer ilay rdv
    numero_facture:{ type: String, required: true },

}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Facture', FactureSchema);
