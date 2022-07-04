const { 
    getAllLaunches ,
    addNewLaunch
} = require('../../models/launches.model');



function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches);
}



function httpAddNewLaunch(req,res){
    const launch = req.body;
    // convierto a fecha launchDate (pues llega como str)
    launch.launchDate = new Date(launch.launchDate);
    // agrego
    addNewLaunch(launch);
    // respuesta
    res.status(200).json(launch);
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}