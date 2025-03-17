const jwt = require('jsonwebtoken');

// Fonction pour générer un Access Token
exports.generate_accessToken= async (user)=> {
   return await  jwt.sign(
        { 
          userId: user._id, 
          username: user.nom+' '+user.prenom, 
          role: user.role,
          email: user.email,
        },
        process.env.SECRET_KEY_ACCESS, 
        { expiresIn: '10m' }//10min
      );
};
// Fonction pour générer un Refresh Token
exports.generate_refreshToken= async (user)=> {
    return await  jwt.sign(
         { 
           userId: user._id, 
           username: user.nom+' '+user.prenom, 
           role: user.role,
           email: user.email,
         },
         process.env.SECRET_KEY_REFRESH, 
         { expiresIn: '1h' } //1 heure
       );
 };


//  lecture
//  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (decoded.role === 'admin') {
//       console.log('Cet utilisateur est un administrateur');
//     } else {
//       console.log('Cet utilisateur a un rôle limité');
//     }
//   });