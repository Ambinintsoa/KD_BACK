const express = require("express");
const avisRouter = express.Router();
const AvisClientController=require("../controllers/AvisClientController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

avisRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], AvisClientController.save);
avisRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], AvisClientController.delete);

avisRouter.get("/:page",[verifyToken], AvisClientController.read);
avisRouter.get("/search/:page",[verifyToken], AvisClientController.readBy);
avisRouter.get("/sort/:page",[verifyToken], AvisClientController.readByScoreDESC);
avisRouter.get("/id/:id",[verifyToken], AvisClientController.readById);

module.exports = avisRouter;


