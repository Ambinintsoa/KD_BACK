const express = require("express");
const serviceRouter = express.Router();
const ServiceController=require("../controllers/ServiceController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
//upload file
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
serviceRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ServiceController.save);
serviceRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], ServiceController.update);
serviceRouter.delete("",[verifyToken,RoleMiddleware.adminRole], ServiceController.delete);

serviceRouter.get("",[verifyToken], ServiceController.read);
serviceRouter.get("/promotions", ServiceController.allPromotions);
serviceRouter.get("/search/:page",[verifyToken], ServiceController.readBy);
serviceRouter.get("/id/:id",[verifyToken], ServiceController.readById);
serviceRouter.post("/import",upload.single('file'),[verifyToken], ServiceController.import);
serviceRouter.get("/export",[verifyToken], ServiceController.export);

module.exports = serviceRouter;


