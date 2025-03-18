const Utilisateur = require('../models/Utilisateur');
const JWT = require('../utils/JWT');
const bcrypt = require('bcrypt');

// enregistre l'utilisateur
exports.saveUser = async (userData) => {
    try {
        const user = new Utilisateur(userData);
        if (!user.email || !user.mot_de_passe) throw new Error("Email et mot de passe sont obligatoires !");

        let email = user.email;
        if (! await Utilisateur.findOne({ email })) {
            user.mot_de_passe = await bcrypt.hash(user.mot_de_passe, 10);
            user.role = user.role || "Client";
            user.save();

        } else {
            throw new Error("Cet Email est déjà rattaché à un compte!");
        }

    }
    catch (error) {
        console.error(error);
        throw error;
    }
}

// verifie l'authentification
exports.login = async (data) => {
    try {
        const { email, mot_de_passe } = data;
        console.log(data);
        const user = await Utilisateur.findOne({ email });
        if (!user) {
            throw new Error('Email invalide');
        }

        const mot_de_passeMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!mot_de_passeMatch) {
            throw new Error('Mot de passe invalide');
        }

        let date_limite = new Date();
        date_limite.setMinutes(date_limite.getMinutes() + 10000);// 10 minutes
        
        let token_object = {
            token_access: await JWT.generate_accessToken(user),
            token_refresh: await JWT.generate_refreshToken(user),
            expiration: date_limite
        };

        return token_object;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// lit tous les utilisateurs
exports.read=async(offset,limit)=>{
    try {
        console.log(offset,limit);
        return await Utilisateur.find().skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

