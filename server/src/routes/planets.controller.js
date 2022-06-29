const planets = require('../models/planets.model');

function getAllPlanets(req,res){
    return res.send(200).json(planets);
}

module.exports = {
    getAllPlanets
}