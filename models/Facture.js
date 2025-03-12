const mongoose = require("mongoose");

const FactureSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    montant_total: { type: Number, required: false },
    statut: { type: String, required: true },
    numero_facture:{ type: String, required: true },

}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Facture', FactureSchema);
