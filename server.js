const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors'); 
require('dotenv').config(); 

const app = express();

// Utilisation du port de Render ou 3000 en local
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors()); 
app.use(express.json());
//connexion à mongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
   }).then(() => console.log("MongoDB connecté")) 
     .catch(err => console.log(err)); 


// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express sur Render !");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});


require('./default_data/default_data_user');
require('./default_data/generateDefaultCars');
require('./default_data/generateDefaultDevis');
require('./default_data/generateDefaulDetailsDevis');
require('./default_data/generateDefaultFactures');
require('./default_data/generateDefaultDetailsFactures');
require('./default_data/generateDefaultPaiements');
require('./default_data/generateDefaultCategories');
require('./default_data/ServiceDefaultData');
require('./default_data/generateDefaultProduits');
require('./default_data/generateDefaultUsageProduitService');
require('./default_data/generateDefaultRendezVous');
require('./default_data/generateDefaultTaches');
require('./default_data/AvisClient');

