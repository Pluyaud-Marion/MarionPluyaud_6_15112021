const passwordValidator = require('password-validator');

//création du schéma
const schemaPassword = new passwordValidator();

//le schéma que doit respecter le password
schemaPassword
.is().min(6)                   // Doit contenir au moins 6 caractères 
.is().max(100)                 // Doit contenir max 100 caractères 
.has().uppercase(1)            // Doit avoir au moins 1 Majuscule
.has().digits(2)               // Doit avoir au moins 2 chiffres
.has().not().spaces()          // Pas d'espaces
.has().symbols()                // impose symbole
.has().not().symbols(2)          // max 2 symboles

//exportation du schéma -> importé dans middleware/password
module.exports = schemaPassword;