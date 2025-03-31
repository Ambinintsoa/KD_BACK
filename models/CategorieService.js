const mongoose = require("mongoose");

const CategorieServiceSchema = new mongoose.Schema({
    nom_categorie: { type: String, required: true },
    statut: { type:Number,required:true,default:0}
});
module.exports = mongoose.model('CategorieService', CategorieServiceSchema);
