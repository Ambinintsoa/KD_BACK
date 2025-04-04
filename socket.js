const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY_ACCESS || 'votre_clé_secrète_par_défaut';
const FRONTEND_URL = process.env.FRONTEND_URL || 'votre_clé_secrète_par_défaut';

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
          origin:FRONTEND_URL, // Autoriser l'origine Angular
          methods: ['GET', 'POST'], // Méthodes HTTP autorisées
          credentials: true // Si vous utilisez withCredentials
        }
      });

// Middleware pour vérifier le token JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Récupérer le token envoyé par le client
  if (token) {
      // Vérifie la validité du token ici (par exemple avec JWT)
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
          if (err) {
              return next(new Error('Token invalide'));
          }
          // Si le token est valide, continue
          socket.user = decoded; // Si besoin d'utiliser les infos du token
          next();
      });
  } else {
      return next(new Error('Token manquant'));
  }
});

// Gestion des connexions après validation du token
io.on('connection', (socket) => {// Vérifier le contenu du token

  if (socket.user.role === 'admin') {
    socket.join('admin');
    console.log(`Utilisateur ${socket.user.userId} a rejoint la salle admin`);
  } else {
    console.log('Utilisateur non admin, rôle:', socket.user.role);
  }

  socket.on('disconnect', () => {
    console.log('Déconnexion:', socket.id);
  });
});

  return io;
}

module.exports = { initializeSocket, getIo: () => io };