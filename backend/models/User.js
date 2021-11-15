//importation mongosse
const mongoose = require('mongoose');

//importation mongoose-unique-validator pour inscription unique
const uniqueValidator = require('mongoose-unique-validator');

//Création du modèle
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique : true},
    password : {type : String, required : true}
});

//sécurité conseillée pour ne pas avoir 2 fois la même adresse mail dans db
userSchema.plugin(uniqueValidator);

//exportation du modèle
module.exports = mongoose.model("user", userSchema)