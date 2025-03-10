const express = require("express");
const app = express();

// Utilisation du port de Render ou 3000 en local
const port = process.env.PORT || 3000;

// Route principale
app.get("/", (req, res) => {
  res.send("Hello, Express sur Render !");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
