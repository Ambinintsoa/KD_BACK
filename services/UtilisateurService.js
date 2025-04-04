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
        const user = await Utilisateur.findOne({email: email });
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
exports.read = async (page = 1, limit = 10, search = '', sortBy = 'nom', sortOrder = 'asc') => {
    try {
      // Construire les critères de recherche
      const query = search
        ? {
            $or: [
              { nom: { $regex: search, $options: 'i' } }, // Recherche insensible à la casse sur le nom
              { email: { $regex: search, $options: 'i' } }, // Recherche sur l'email
              { prenom: { $regex: search, $options: 'i' } }, // Recherche sur le prénom
              { role: { $regex: search, $options: 'i' } }
            ]
          }
        : {};
  
      // Définir l'ordre de tri
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
      // Récupérer les utilisateurs avec pagination
      const utilisateurs = await Utilisateur.find(query)
        .select('-mot_de_passe') // Exclure le mot de passe
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);
  
      // Compter le nombre total d'utilisateurs correspondant à la recherche
      const total = await Utilisateur.countDocuments(query);
  
      return { utilisateurs, total };
    } catch (error) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  };
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
    
      // Récupérer un utilisateur par ID
      exports.getUtilisateurById=async(id) =>{
        try {
          const utilisateur = await Utilisateur.findById(id).select('-mot_de_passe');
          if (!utilisateur) throw new Error('Utilisateur non trouvé');
          return utilisateur;
        } catch (error) {
          throw error.message === 'Utilisateur non trouvé' ? error : new Error('Erreur lors de la récupération de l’utilisateur');
        }
      }
    
      // Créer un utilisateur
      exports.createUtilisateur= async(data) =>{
        try {
          const { mot_de_passe, ...rest } = data;
          const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
          const utilisateur = new Utilisateur({
            ...rest,
            mot_de_passe: hashedPassword
          });
          return await utilisateur.save();
        } catch (error) {
          throw new Error('Erreur lors de la création de l’utilisateur');
        }
      }
    
      // Mettre à jour un utilisateur
      exports.updateUtilisateur= async(id, data)=> {
        try {
          const { mot_de_passe, ...rest } = data;
          const updateData = { ...rest };
          if (mot_de_passe) {
            updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
          }
          const utilisateur = await Utilisateur.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
          ).select('-mot_de_passe');
          if (!utilisateur) throw new Error('Utilisateur non trouvé');
          return utilisateur;
        } catch (error) {
          throw error.message === 'Utilisateur non trouvé' ? error : new Error('Erreur lors de la mise à jour de l’utilisateur');
        }
      }
    
      // Supprimer un utilisateur
      exports.deleteUtilisateur= async(id)=> {
        try {
          const utilisateur = await Utilisateur.findByIdAndDelete(id);
          if (!utilisateur) throw new Error('Utilisateur non trouvé');
          return { message: 'Utilisateur supprimé' };
        } catch (error) {
          throw error.message === 'Utilisateur non trouvé' ? error : new Error('Erreur lors de la suppression de l’utilisateur');
        }
      }


