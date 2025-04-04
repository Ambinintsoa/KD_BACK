const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

const app = express();
const server = http.createServer(app);
const { initializeSocket } = require('./socket'); // Importer depuis socket.js

// Initialisation de Socket.IO
const io = initializeSocket(server);

// Utilisation du port de Render ou 3000 en local
const port = process.env.PORT || 3000;

// Middleware Express
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connecté")) 
  .catch(err => console.log("Erreur de connexion MongoDB :", err)); 

// Routes
app.use('/user', require('./routers/UtilisateurRouter'));
app.use('/produit', require('./routers/ProduitRouter'));
app.use('/categorie', require('./routers/CategorieRouter'));
app.use('/service', require('./routers/ServiceRouter'));
app.use('/voiture', require('./routers/VoitureRouter'));
app.use('/usageproduitservice', require('./routers/UsageProduitServiceRouter'));
app.use('/fournisseur', require('./routers/FournisseurRouter'));
app.use('/avisclient', require('./routers/AvisClientRouter'));
app.use('/marque', require('./routers/MarqueRouter'));
app.use('/categorievoiture', require('./routers/CategorieVoitureRouter'));
app.use('/rendezvous', require('./routers/RDVRouter'));
app.use('/tache', require('./routers/TacheRouter'));
app.use('/devis', require('./routers/DevisRouter'));
app.use('/graph', require('./routers/GraphRouter'));
app.use('/facture', require('./routers/FactureRouter'));
app.use('/paiement', require('./routers/PaiementRouter'));

// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express sur Render !");
});

// Démarrer le serveur
server.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});