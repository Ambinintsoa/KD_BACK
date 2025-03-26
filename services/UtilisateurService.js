const Utilisateur = require('../models/Utilisateur');
const JWT = require('../utils/JWT');
const bcrypt = require('bcrypt');

// enregistre l'utilisateur
exports.saveUser = async (userData) => {
    try {
        const user = new Utilisateur(userData);
        if (!user.email || !user.mot_de_passe) throw new Error("Email et mot de passe sont obligatoires !");
        if(user.salaire && user.salaire<0){
            throw new Error("Le salaire doit être positif !");
        }
        let email = user.email.trim();
        if (! await Utilisateur.findOne({ email })) {
            user.mot_de_passe = await bcrypt.hash(user.mot_de_passe.trim(), 10);
            user.role = user.role || "Client";
            user.nom=user.nom.trim();
            user.prenom=user.prenom.trim();
            user.email=user.email.trim();
            user.genre=user.genre.trim() || "Indefini";
            user.adresse = (user.adresse?.trim() || '');
            user.contact = (user.contact?.trim() || '');
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

// modifie les utilisateurs
exports.update=async(userdata)=>{
    try {
        const utilisateur= new Utilisateur(userdata);
        const initial_utilisateur = await Utilisateur.findOne({ _id:utilisateur._id });
        if(! initial_utilisateur) throw new Error("Aucun utilisateur correspondant !");

        if(utilisateur.salaire && utilisateur.salaire<0){
             throw new Error("Le salaire doit être positif !");
        }
        
        initial_utilisateur.nom = (utilisateur.nom && utilisateur.nom.trim()) || initial_utilisateur.nom; // Mise à jour de l'attribut
        initial_utilisateur.prenom = (utilisateur.prenom && utilisateur.prenom.trim()) || initial_utilisateur.prenom; // Mise à jour de l'attribut
        initial_utilisateur.email = (utilisateur.email && utilisateur.email.trim()) || initial_utilisateur.email; // Mise à jour de l'attribut
        initial_utilisateur.adresse = (utilisateur.adresse && utilisateur.adresse.trim()) || initial_utilisateur.adresse; // Mise à jour de l'attribut
        initial_utilisateur.contact = (utilisateur.contact && utilisateur.contact.trim()) || initial_utilisateur.contact; // Mise à jour de l'attribut
        initial_utilisateur.role = (utilisateur.role && utilisateur.role.trim()) || initial_utilisateur.role; // Mise à jour de l'attribut
        initial_utilisateur.poste = (utilisateur.poste && utilisateur.poste.trim()) || initial_utilisateur.poste; // Mise à jour de l'attribut
        initial_utilisateur.genre = (utilisateur.genre && utilisateur.genre.trim()) || initial_utilisateur.genre; // Mise à jour de l'attribut
        initial_utilisateur.date_de_naissance = utilisateur.date_de_naissance || initial_utilisateur.date_de_naissance; // Mise à jour de l'attribut
        initial_utilisateur.salaire = utilisateur.salaire || initial_utilisateur.salaire; // Mise à jour de l'attribut
        initial_utilisateur.image = (utilisateur.image && utilisateur.image.trim()) || initial_utilisateur.image; // Mise à jour de l'attribut
        
        
        await initial_utilisateur.save(); // Sauvegarde les modifications
    } catch (error) {
        console.error(error);
        throw error;
    }
}
exports.getMecanicienDisponible=async(offset,limit)=>{
    try {
        return User.find({role:"mecanicien"}).join("rendezvous").where("rendezvous.etat=1").skip(offset).limit(limit);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

