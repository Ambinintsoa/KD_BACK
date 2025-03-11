const mongoose=require("mongoose");

const UtilisateurSchema=new mongoose.Schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:false},
    email:{type:String,required:true},
    mot_de_passe:{type:String,required:true},
    adresse:{type:String,required:false},
    contact:{type:String,required:false},
    role:{type:String,required:true},
    poste:{type:String,required:false},
});
module.exports=mongoose.model('Utilisateur',UtilisateurSchema);