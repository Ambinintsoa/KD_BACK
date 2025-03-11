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
    genre:{type:String,required:true},
    date_de_naissance:{type:Date,required:true}
    
},{
    timestamps: true  // Cette option ajoutera automatiquement createdAt et updatedAt
  });
module.exports=mongoose.model('Utilisateur',UtilisateurSchema);