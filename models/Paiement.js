const mongoose = require("mongoose");

const PaiementSchema = new mongoose.Schema({
    date_heure: { type: Date, required: true, default: Date.now },
    facture: { type: mongoose.Schema.Types.ObjectId, ref: "Facture", required: true },
    montant_payer: { type: Number, required: false },
    etat:{type:Number,required:true,default:0},
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Paiement', PaiementSchema);
