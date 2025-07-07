const express = require("express");
const paiementRouter = express.Router();
const PaiementController=require("../controllers/PaiementController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');


paiementRouter.post('/save', [verifyToken], PaiementController.save);

module.exports = paiementRouter;


