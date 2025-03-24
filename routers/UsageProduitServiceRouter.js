const express = require("express");
const usageProduitServiceRouter = express.Router();
const UsageProduitServiceController=require("../controllers/UsageProduitServiceController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

usageProduitServiceRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], UsageProduitServiceController.save);
usageProduitServiceRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], UsageProduitServiceController.update);
usageProduitServiceRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], UsageProduitServiceController.delete);

usageProduitServiceRouter.get("/:page",[verifyToken], UsageProduitServiceController.read);
usageProduitServiceRouter.get("/search/:page",[verifyToken], UsageProduitServiceController.readBy);
usageProduitServiceRouter.get("/id/:id",[verifyToken], UsageProduitServiceController.readById);


module.exports = usageProduitServiceRouter;


