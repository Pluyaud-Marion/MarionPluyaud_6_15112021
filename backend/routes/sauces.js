//importation express
const express = require('express');
const router = express.Router();

//importation des fonctions du controller User
const saucesController = require('../controllers/sauces');

//importation des middlewares
const authentification = require('../middleware/authentification');
const multer = require('../middleware/multer-config');



//router.post("/", authentification, saucesController.createSauce);
//CREATE
router.post('/', authentification, multer, saucesController.createSauce);

//READ route get - renvoie un tableau avec toutes les sauces de la base
router.get('/', authentification, saucesController.getAllSauces);

//READ route get - renvoie une sauce à partir de son id (id de la sauce)
router.get('/:id', authentification, saucesController.getOneSauce);

//UPDATE route put
router.put('/:id', authentification, multer, saucesController.updateSauce);

//DELETE
router.delete('/:id', authentification, saucesController.deleteSauce);

//exportation du module
module.exports = router;