const express = require('express');
const {PORT} = require('./config/server-config');

const app = express();

const routes = require('./routes');

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies


app.use('/', routes);

app.listen(PORT, function(){
    console.log("Server is up and running ..");
});