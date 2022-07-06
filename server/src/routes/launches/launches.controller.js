const { 
    getAllLaunches ,
    addNewLaunch,
    existLaunchById,
    abortLaunchById
} = require('../../models/launches.model');


// get
function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches());
}

// add
function httpAddNewLaunch(req,res){
    const launch = req.body;
    console.log(launch);
    // valido datos obligatorios
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target ){
        return res.status(400).json({
            error: 'Missing required fields'
        })
    }
    // convierto a fecha launchDate (pues llega como str)
    launch.launchDate = new Date(launch.launchDate);
    // testeo que la fecha tenga el formato apropiado
    if ( launch.launchDate.toString() === 'Invalida Data'){
        return res(400).json({
            error:'Invalid Data'
        })
    }
    // agrego
    addNewLaunch(launch);
    // respuesta
    res.status(200).json(launch);
}


// delete
function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    
    if (!existLaunchById(launchId)) {
        return res.status(404).json({
            error:'No existe el lanzamiento'
        })
    } else {
        const aborted = abortLaunchById(launchId);
        return res.status(200).json(aborted);
    } 
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}