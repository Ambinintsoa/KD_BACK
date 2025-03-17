const Utilisateur=require('../models/Utilisateur');
const JWT=require('../utils/JWT');
const bcrypt = require('bcrypt');

// enregistre l'utilisateur
exports.saveUser = async (userData)=>{
    try{
        const user = new Utilisateur(userData);
        if(!user.email || !user.mot_de_passe) throw new Error("Email et mot de passe sont obligatoires !");

        user.mot_de_passe= bcrypt.hash(password, 10);
        user.save();

    }
    catch(error){
        console.err(error);
        throw error;
    }
}

