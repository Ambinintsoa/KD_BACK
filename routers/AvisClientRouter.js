const express = require("express");
const avisRouter = express.Router();
const AvisClientController=require("../controllers/AvisClientController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

avisRouter.post('/',[verifyToken], AvisClientController.createAvis);
avisRouter.get('/',[verifyToken], AvisClientController.listAvis);
avisRouter.put('/validate/:id', [verifyToken, RoleMiddleware.adminRole], AvisClientController.validateAvis);
avisRouter.delete('/:id', [verifyToken, RoleMiddleware.adminRole], AvisClientController.deleteAvis);
avisRouter.get('/validated/random', AvisClientController.getValidatedAvisRandom);

module.exports = avisRouter;


