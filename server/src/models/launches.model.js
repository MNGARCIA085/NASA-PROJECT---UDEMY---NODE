const launchesDatabase = require('./launches.mongo');
const planets =  require('./planets.mongo');



// valor por defecto para el número de lanzamiento
const DEFAULT_FLIGHT_NUMBER = 100;


// un lanzamiento en particular
const launch = {
    mission:'dsfs',
    rocket:'dsfds',
    launchDate:new Date('December 17, 2020'),
    target:'32423',
    fligthNumber: 100, // id único
    customer: ['NASA', 'ztm'],
    upcoming:true,
    success:true
}



// le ingresamos el lanzamiento particular a launches
saveLaunch(launch);


//
async function getAllLaunches(){
    return await launchesDatabase.find( {}, {'_id':0, '__v':0} );
}




// agregar un lanzamiento
async function scheduleNewLaunch(launch) {  
    const newFlightNumber = await getLatestFlightNumber() + 1;
  
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: newFlightNumber,
    });
  
    await saveLaunch(newLaunch);
  }



  //
  async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
  }


// si existe un lanzamiento con ese id
async function existsLaunchWithId(launchId) {
    try {
        return await findLaunch({
            flightNumber: launchId,
        });
    } catch (err){
        console.log(err);
    }
  }




// borrar
async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
      flightNumber: launchId,
    }, {
      upcoming: false,
      success: false,
    });
  
    return aborted.modifiedCount === 1;
  }


// obtener el último número de vuelo
async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    // si no hay ninguno devuelvo el valor por defecto
    if (!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    // sino devuelvo el que encontró
    return latestLaunch.flightNumber;

}



// guardar lanzamiento
async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName:launch.target,
    })
    if (!planets) {
        throw new Error('No matching planets found');
    }
    await launchesDatabase.findOneAndUpdate({
      flightNumber: launch.flightNumber,
    }, launch, {
      upsert: true,
    });
  }



// exportamos para que se pueda usar desde otro lado
module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}