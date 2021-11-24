const http = require('http');

//importation du package des variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

//importation de l'application
const app = require('./app');

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

const port = normalizePort(process.env.PORT || '3000');

//paramétrage du port avec méthode set de express
app.set("port", port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

//création du serveur
const server = http.createServer(app);
  
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });

//serveur écoute les requêtes sur le port défini dans la variable port (variable d'environnement)
server.listen(port);
  