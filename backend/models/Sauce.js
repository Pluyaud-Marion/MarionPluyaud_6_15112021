//importation mongosse
const mongoose = require('mongoose');


//Création du modèle
const sauceSchema = mongoose.Schema({
    userId: {type : String, required : true, unique : true},
    name : {type : String, required : true},
    manufacturer : {type: String, required : true},
    description : {type : String, required : true},
    mainPepper : {type : String, required : true},
    imageUrl : {type : String},
    heat : {type : Number, required : true},
    likes : {type : Number},
    dislikes : {type : Number}
});


//exportation du modèle
module.exports = mongoose.model("sauce", sauceSchema)