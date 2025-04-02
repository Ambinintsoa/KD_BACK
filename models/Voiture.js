const mongoose = require("mongoose");

const VoitureSchema = new mongoose.Schema({
    immatriculation: { type: String, required: true },
    kilometrage: { type: Number, required: false },
    marque: { type: mongoose.Schema.Types.ObjectId,ref:"Marque", required: true },
    categorie: { type: mongoose.Schema.Types.ObjectId, ref:"CategorieVoiture",required: true },
    statut: { type:Number,required:true,default:0},
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Voiture', VoitureSchema);
