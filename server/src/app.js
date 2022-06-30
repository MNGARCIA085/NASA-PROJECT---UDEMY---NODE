const express = require('express');
const cors = require('cors');


const planetsRouter = require('./routes/planets.router');

const app = express();


app.use( cors ( {origin: 'http://localhost:3000' }) ); // origin en este caso es la dir. del backend
app.use(express.json());

app.use(planetsRouter);

module.exports = app;