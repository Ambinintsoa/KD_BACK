const express = require("express");
const fournisseurRouter = express.Router();
const FournisseurController=require("../controllers/FournisseurController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

fournisseurRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], FournisseurController.save);
fournisseurRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], FournisseurController.update);
fournisseurRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], FournisseurController.delete);

fournisseurRouter.get("/:page",[verifyToken], FournisseurController.read);
fournisseurRouter.get("/search/:page",[verifyToken], FournisseurController.readBy);
fournisseurRouter.get("/id/:id",[verifyToken], FournisseurController.readById);


module.exports = fournisseurRouter;


