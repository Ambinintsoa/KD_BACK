const mongoose = require("mongoose");

const RendezVousSchema = new mongoose.Schema({
    date_heure_debut: { type: Date, required: true },
    date_heure_fin: { type: Date, required: false },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
    mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false },
    voiture: { type: mongoose.Schema.Types.ObjectId, ref: "Voiture", required: false },
    montant_total: { type: Number, required: false },
    statut: { type: String, required: true,default:"Non Assigné"}, // En cours; terminer
    etat:{type:Number,required:true,default:0} //0 : pas encore terminé ; 1 terminé
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('RendezVous', RendezVousSchema);
