const rateLimit = require('express-rate-limit');


exports.loginLimiter =  rateLimit({
        windowMs : 15 * 60 * 1000, // 15min de blocage
        max : 5, // max 5 tentatives
        message : "Trop de tentative de connexion avec des identifiants invalides. Réessayez après 15min"
});
    

exports.appliLimiter =  rateLimit({
        windowMs : 15 * 60 * 1000,
        max : 50, 
        message : "Vous avez effectué trop de requêtes"
});
    