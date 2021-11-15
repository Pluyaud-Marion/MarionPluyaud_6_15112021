const http = require('http');

//importation du package des variables d'environnement
const dotenv = require('dotenv');
const result = dotenv.config();

//importation de l'application
const app = require('./app');

//paramétrage du port avec méthode set de express
app.set("port", process.env.PORT);


//création du serveur
const server = http.createServer(app);

//serveur écoute les requêtes sur le port défini dans les variables d'environnement
server.listen(process.env.PORT)
