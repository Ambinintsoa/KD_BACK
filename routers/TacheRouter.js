const express = require("express");
const tache_Router = express.Router();
const Tache=require("../controllers/TacheController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

tache_Router.put("/update/:idRDV",[verifyToken], Tache.update);
tache_Router.get("/search/:idRDV",[verifyToken], Tache.readBy);
// tache_Router.get("/:page",[verifyToken], Tache.read);

module.exports = tache_Router;


