//importation express
const express = require('express');


//importation des fonctions du controller User
const saucesController = require('../controllers/sauces');

const router = express.Router();

router.post("/", saucesController.createSauce);


//exportation du module
module.exports = router;