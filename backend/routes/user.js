//importation express
const express = require('express');

//importation des fonctions du controller User
const userController = require('../controllers/user');

const router = express.Router();

//route signup
router.post("/signup", userController.signup);

//route login
router.post("/login", userController.login);

//exportation du module
module.exports = router;