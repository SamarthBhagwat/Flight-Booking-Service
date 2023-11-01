const express = require('express');
const PORT = require('./config/port-config');

const app = express();

const routes = require('./routes');

app.use('/', routes);

app.listen(PORT, function(){
    console.log("Server is up and running ..");
});