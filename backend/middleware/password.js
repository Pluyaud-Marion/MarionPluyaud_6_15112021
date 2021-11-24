//importation schéma issu de models/Password
const schemaPassword = require('../models/Password');

//exportation pour importation dans routes/user
module.exports = (req, res, next) => {
    //si password n'est pas assez fort
    if(!schemaPassword.validate(req.body.password)){
        res.status(400).json({ message : "Le mot de passe n'est pas conforme. Réessayez avec au moins 6 caractères, 1 majuscule, 2 chiffres et 1 caractère spécial"})
    }else{
        next();
    }
}