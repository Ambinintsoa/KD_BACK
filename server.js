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

app.use('/user',require('./routers/UtilisateurRouter'));

// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express sur Render !");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});

