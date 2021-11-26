//importation schéma issu de models/Password
const schemaPassword = require('../models/Password');
//importation http-status
const status = require('http-status');

//exportation pour importation dans routes/user
module.exports = (req, res, next) => {
    //si password n'est pas assez fort
    if(!schemaPassword.validate(req.body.password)){
        res.status(status.BAD_REQUEST).json({ message : "Le mot de passe n'est pas conforme. Réessayez avec au moins 6 caractères, 1 majuscule, 2 chiffres et 1 caractère spécial"})
    } else {
        next();
    }
}