const express = require("express");
const serviceRouter = express.Router();
const ServiceController=require("../controllers/ServiceController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

serviceRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ServiceController.save);
serviceRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], ServiceController.update);
serviceRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], ServiceController.delete);

serviceRouter.get("/:page",[verifyToken], ServiceController.read);
serviceRouter.get("/search/:page",[verifyToken], ServiceController.readBy);
serviceRouter.get("/:id",[verifyToken], ServiceController.readById);


module.exports = serviceRouter;


