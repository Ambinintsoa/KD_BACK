const userService = require("../services/UtilisateurService");
const jwt = require('jsonwebtoken');

//recupere les données de l'utilisateurs et l'enregistre 
exports.register = async (req, res) => {
    try {
        await userService.saveUser(req.body);
        res.status(201).json({ message: "Inscription à succes" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// recupere le mot_de_passe et email de l'utilisateur et renvoie le token (access,refresh,date_limite)
exports.login = async (req, res) => {
    try {
        let token = await  userService.login(req.body);
       
        res.cookie("refresh_token",token.token_refresh, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', token.token_access);
        
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

exports.refreshToken=async (req,res)=>{
    const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).send('Access Denied. No refresh token provided.');
  }

  try {
    const decoded = jwt.verify(refreshToken,  process.env.SECRET_KEY_REFRESH);
    const accessToken = jwt.sign({ userId: decoded.userId },  process.env.SECRET_KEY_ACCESS, { expiresIn: '1h' });

    res
      .header('Authorization', accessToken)
      .send(decoded.userId);
  } catch (error) {
    return res.status(400).send('Invalid refresh token.'+error);
  }

}