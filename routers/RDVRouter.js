const express = require("express");
const rdv_Router = express.Router();
const RDVController=require("../controllers/RDVController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

rdv_Router.post("/save",[verifyToken], RDVController.saveRDV);
rdv_Router.put("/update",[verifyToken], RDVController.update);
rdv_Router.post("/assign",[verifyToken,RoleMiddleware.managerRole], RDVController.assignRDV);
// rdv_Router.delete("/:id",[verifyToken,RoleMiddleware.adminRole], RDVController.delete);
rdv_Router.get("/id/:id",[verifyToken], RDVController.readById);
rdv_Router.get("/",[verifyToken], RDVController.read);
rdv_Router.post("/mecanicien_rdv/:page",[verifyToken], RDVController.readByMecanicien);
rdv_Router.get("/statut/:page",[verifyToken], RDVController.readByStatus);
rdv_Router.post("/search/:page",[verifyToken], RDVController.readBy);

//mecanicien disponible
rdv_Router.post("/mecanicien/:page",[verifyToken,RoleMiddleware.managerRole], RDVController.getMecanicienDisponible);

module.exports = rdv_Router;


