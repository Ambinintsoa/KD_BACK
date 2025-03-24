const express = require("express");
const rdv_Router = express.Router();
const RDVController=require("../controllers/RDVController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

rdv_Router.post("/save",[verifyToken], RDVController.saveRDV);
// rdv_Router.put("/update",[verifyToken,RoleMiddleware.adminRole], RDVController.update);
// rdv_Router.delete("/:id",[verifyToken,RoleMiddleware.adminRole], RDVController.delete);

// rdv_Router.get("/:page",[verifyToken], RDVController.read);
// rdv_Router.get("/search/:page",[verifyToken], RDVController.readBy);
// rdv_Router.get("/id/:id",[verifyToken], RDVController.readById);


module.exports = rdv_Router;


