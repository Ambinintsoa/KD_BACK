const userService = require("../services/UtilisateurService");
const jwt = require('jsonwebtoken');

//recupere les données de l'utilisateurs et l'enregistre 
exports.register = async (req, res) => {
    try {
        // Tableau pour stocker les erreurs
        const errors = [];

        // Champs attendus selon votre interface CreateUser
        const {
            email,
            mot_de_passe,
            genre,
            nom,
            prenom,
            adresse,
            date_de_naissance,
            role
        } = req.body;

        // Validation des champs
        if (!email) {
            errors.push({ field: 'email', message: 'L\'email est requis' });
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push({ field: 'email', message: 'L\'email est invalide' });
        }

        if (!mot_de_passe) {
            errors.push({ field: 'mot_de_passe', message: 'Le mot de passe est requis' });
        } else if (mot_de_passe.length < 6) {
            errors.push({ field: 'mot_de_passe', message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        if (!genre) {
            errors.push({ field: 'genre', message: 'Le genre est requis' });
        } else if (!['Homme', 'Femme', 'Autre'].includes(genre)) {
            errors.push({ field: 'genre', message: 'Le genre doit être Homme, Femme ou Autre' });
        }

        if (!nom) {
            errors.push({ field: 'nom', message: 'Le nom est requis' });
        }

        if (!prenom) {
            errors.push({ field: 'prenom', message: 'Le prénom est requis' });
        }

        if (!adresse) {
            errors.push({ field: 'adresse', message: 'L\'adresse est requise' });
        }

        if (!date_de_naissance) {
            errors.push({ field: 'date_de_naissance', message: 'La date de naissance est requise' });
        } else {
            const date = new Date(date_de_naissance);
            if (isNaN(date.getTime())) {
                errors.push({ field: 'date_de_naissance', message: 'La date de naissance est invalide' });
            } else if (date > new Date()) {
                errors.push({ field: 'date_de_naissance', message: 'La date de naissance ne peut pas être dans le futur' });
            }
        }

        if (!role) {
            errors.push({ field: 'role', message: 'Le rôle est requis' });
        } else if (!['user', 'admin'].includes(role)) {
            errors.push({ field: 'role', message: 'Le rôle doit être user ou admin' });
        }

        // Si des erreurs sont détectées, renvoyer le tableau d'erreurs avec un statut 400
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Si tout est valide, procéder à l'enregistrement
        await userService.saveUser(req.body);
        res.status(201).json({ message: "Inscription réussie" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// recupere le mot_de_passe et email de l'utilisateur et renvoie le token (access,refresh,date_limite)
exports.login = async (req, res) => {
    try {
        let token = await  userService.login(req.body);
        res.status(201).json({ token: token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
// donne la liste des utilisateurs avec pagination
exports.read= async (req,res)=>{
    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;

        let user_list= await userService.read(offset,limit);
        res.status(201).json({ users: user_list });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

//modifie les données  de l'utilisateur
exports.update=async (req,res)=>{
    try {
       
        await userService.update(req.body);
        res.status(201).json({ message: "Utilisateur modifié avec succès" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refresh;
  
    if (!refreshToken) {
      return res.status(403).json({ message: 'Aucun refresh token fourni' });
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
  
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.SECRET_KEY_ACCESS,
        { expiresIn: '10m' }
      );
  
      return res.status(200).json({
        token: accessToken,
        userId: decoded.userId
      });
    } catch (error) {
      return res.status(403).json({ message: 'Refresh token invalide', error });
    }
  }


  