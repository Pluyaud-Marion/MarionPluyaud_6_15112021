//importation express
const express = require('express');
const router = express.Router();

//importation des fonctions du controller User
const saucesController = require('../controllers/sauces');

//importation des middlewares
const authentification = require('../middleware/authentification');
const multer = require('../middleware/multer-config');

//importation middleware limiter
const limiter = require('../middleware/limiter');

//CREATE route post - créer une sauce
router.post('/', authentification, limiter.appliLimiter, multer, saucesController.createSauce);

//READ route get - renvoie un tableau avec toutes les sauces de la base
router.get('/', authentification, limiter.appliLimiter, saucesController.getAllSauces);

//READ route get - renvoie une sauce à partir de son id
router.get('/:id', authentification, limiter.appliLimiter, saucesController.getOneSauce);

//UPDATE route put
router.put('/:id', authentification, limiter.appliLimiter, multer, saucesController.updateSauce);

//DELETE
router.delete('/:id', authentification, limiter.appliLimiter, saucesController.deleteSauce);

router.post('/:id/like', authentification, limiter.appliLimiter, saucesController.likes);


//exportation du module
module.exports = router;