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
        } else if (!['Homme', 'Femme'].includes(genre)) {
            errors.push({ field: 'genre', message: 'Le genre doit être Homme ou Femme' });
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

        if (role &&!['user', 'admin','mecanicien'].includes(role)) {
            errors.push({ field: 'role', message: 'Le rôle doit être user ou admin ou mecanicien' });
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
exports.read = async (req, res) => {
    try {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      let search = req.query.search || '';
      let sortBy = req.query.sortBy || 'nom';
      let sortOrder = req.query.orderBy || 'asc'; // Utiliser "orderBy" comme dans votre exemple
  
      const { utilisateurs, total } = await userService.read(page, limit, search, sortBy, sortOrder);
  
      res.status(200).json({
        utilisateurs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };



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

  exports.getUtilisateurById = async (req, res) => {
    try {
      const utilisateur = await userService.getUtilisateurById(req.params.id);
      res.status(200).json(utilisateur);
    } catch (error) {
      res.status(error.message === 'Utilisateur non trouvé' ? 404 : 500).json({ message: error.message });
    }
  };
  
  exports.createUtilisateur = async (req, res) => {
    try {
      const utilisateur = await userService.createUtilisateur(req.body);
      res.status(201).json(utilisateur);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.updateUtilisateur = async (req, res) => {
    try {
      const utilisateur = await userService.updateUtilisateur(req.params.id, req.body);
      res.status(200).json(utilisateur);
    } catch (error) {
      res.status(error.message === 'Utilisateur non trouvé' ? 404 : 400).json({ message: error.message });
    }
  };
  
  exports.deleteUtilisateur = async (req, res) => {
    try {
      const result = await userService.deleteUtilisateur(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.message === 'Utilisateur non trouvé' ? 404 : 500).json({ message: error.message });
    }
}