const mongoose = require("mongoose");

const FournisseurSchema = new mongoose.Schema({
    nom_fournisseur: { type: String, required: true },
    image: { type: String, required: true },
    contact:{type:String,required:true},
    email:{type:String,required:false},
    statut: { type:Number,required:true,default:0}
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Fournisseur', FournisseurSchema);