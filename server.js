const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); 
require('dotenv').config(); 
const cookieParser = require('cookie-parser');
const app = express();

// Utilisation du port de Render ou 3000 en local
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());
//connexion à mongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
   }).then(() => console.log("MongoDB connecté")) 
     .catch(err => console.log(err)); 

app.use('/user',require('./routers/UtilisateurRouter'));
app.use('/produit',require('./routers/ProduitRouter'));
app.use('/categorie',require('./routers/CategorieRouter'));
app.use('/service',require('./routers/ServiceRouter'));
app.use('/voiture',require('./routers/VoitureRouter'));
app.use('/usageproduitservice',require('./routers/UsageProduitServiceRouter'));
app.use('/fournisseur',require('./routers/FournisseurRouter'));
app.use('/avisclient',require('./routers/AvisClientRouter'));
app.use('/rendezvous',require('./routers/RDVRouter'));
app.use('/tache',require('./routers/TacheRouter'));

// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express sur Render !");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});

