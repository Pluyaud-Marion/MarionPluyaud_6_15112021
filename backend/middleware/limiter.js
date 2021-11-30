//importation express-rate-limit
const rateLimit = require('express-rate-limit');

//importation dotenv
const dotenv = require('dotenv');
dotenv.config();

//importation node-mailer
const nodemailer = require('nodemailer');

//paramétrage du transporter
const transporter = nodemailer.createTransport({
        host : process.env.SMTPPATH,
        port : 465,
        secure : true,
        auth : {
                user : process.env.EMAILENVOI,
                pass: process.env.EMAILPASSWORD,
        },
});
//paramétrage pour le dépassement de requête sur l'API globale
const appliFullRequest = {
        from : process.env.EMAILENVOI,
        to : process.env.EMAILDESTINATAIRE,
        subject : "Attention danger sur l'application",
        text : "Un utilisateur a effectué 50 requêtes en 15min sur l'application, il y a danger pour la sécurité de l'application"
};
//paramétrage pour le dépassement de requête sur le login
const loginFullRequest = {
        from : process.env.EMAILENVOI,
        to : process.env.EMAILDESTINATAIRE,
        subject : "Attention danger sur l'application",
        text : "Un utilisateur a fait plus de 5 tentatives de connexion sur l'application avec des identifiants invalides, il y a danger pour la sécurité de l'application"
};

exports.loginLimiter =  rateLimit({
        windowMs : 15 * 60 * 1000, // 15min de blocage
        max : 5, // max 5 tentatives
        message : "Trop de tentative de connexion avec des identifiants invalides. Réessayez après 15min",
        
        //fonction appelée dès que limite atteinte
        onLimitReached: () => {
                transporter.sendMail(loginFullRequest);
        },
});
    

exports.appliLimiter =  rateLimit({
        windowMs : 15 * 60 * 1000,
        max : 50, 
        message : "Vous avez effectué trop de requêtes",

        //fonction appelée dès que limite atteinte
        onLimitReached : () => {
                transporter.sendMail(appliFullRequest);
        },
});
    