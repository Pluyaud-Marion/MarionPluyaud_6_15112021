//importation express
const express = require('express');

//importation des fonctions du controller User
const userController = require('../controllers/user');

//importation du middleware/password
const password = require('../middleware/password');

const router = express.Router();

//route signup avec middleware password pour protection
router.post("/signup", password, userController.signup);

//route login
router.post("/login", userController.login);

//exportation du module
module.exports = router;