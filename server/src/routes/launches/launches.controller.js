const { 
    getAllLaunches ,
    addNewLaunch
} = require('../../models/launches.model');



function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches());
}



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


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}