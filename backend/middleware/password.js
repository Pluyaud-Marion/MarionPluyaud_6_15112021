const passwordValidator = require('password-validator');
const schemaPassword = require('../models/Password');


module.exports = (req, res, next) => {
    //si password n'est pas assez fort
    if(!schemaPassword.validate(req.body.password)){
        res.status(400).json({ message : "Le mot de passe n'est pas assez fort"})
    }else{
        next();
    }
}