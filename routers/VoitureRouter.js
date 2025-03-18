const express = require("express");
const carRouter = express.Router();
const VoitureController=require("../controllers/VoitureController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

carRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], VoitureController.save);
carRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], VoitureController.update);
carRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], VoitureController.delete);

carRouter.get("/:page",[verifyToken], VoitureController.read);
carRouter.get("/search/:page",[verifyToken], VoitureController.readBy);
carRouter.get("/id/:id",[verifyToken], VoitureController.readById);


module.exports = carRouter;


