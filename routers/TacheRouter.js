const express = require("express");
const tache_Router = express.Router();
const Tache=require("../controllers/Tache");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

tache_Router.put("/update",[verifyToken], Tache.update);
tache_Router.get("/search/:id",[verifyToken], Tache.readById);
tache_Router.get("/:page",[verifyToken], Tache.read);


module.exports = tache_Router;


