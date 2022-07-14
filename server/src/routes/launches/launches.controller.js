const { 
    getAllLaunches ,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
} = require('../../models/launches.model');


// get
async function httpGetAllLaunches (req, res) {
    return res.status(200).json(await getAllLaunches());
}

// add
async function httpAddNewLaunch(req,res){
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
    await scheduleNewLaunch(launch);
    // respuesta
    res.status(200).json(launch);
}






// cancelar un lanzamiento
async function httpAbortLaunch(req, res) {

    const launchId = Number(req.params.id);
    console.log(launchId);
  
    // chequeo que exista
    const existsLaunch = await existsLaunchWithId(launchId);
    if (!existsLaunch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }
  
    // si no se pudo cancelar
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: 'Launch not aborted',
      });
    }
  
    // si todo salio bien
    return res.status(200).json({
      ok: true,
    });
  }
  

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}