const express = require("express");
const devisRouter = express.Router();

const DevisController=require("../controllers/DevisController");

const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

devisRouter.post("/", DevisController.getDevis);

module.exports = devisRouter;
