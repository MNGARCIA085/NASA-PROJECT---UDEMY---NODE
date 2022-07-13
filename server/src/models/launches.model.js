const launchesDatabase = require('./launches.mongo');
const planets =  require('./planets.mongo');



// id de lanzamiento
let lastestFlightNumber = 100; // valor inicial


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


function addNewLaunch(launch){
    lastestFlightNumber++; // le sumo 1 al [utimo flight number
    // agrego el lanzamiento, valores: id, objeto
    launches.set(lastestFlightNumber, 
                Object.assign (launch, { // le agrego valores al objeto
                                    flightNumber: lastestFlightNumber, // asigno id
                                    customer: ['ZTM', 'NASA'], // default
                                    upcoming:true, // default
                                    success:true, // default
                }))
} 




//
function existLaunchById(launchId){
    return launches.has(launchId);
}


// borrar
function abortLaunchById(launchId){
    // no lo voy a borrar, sólo le cambiaré el estado
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted
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
    addNewLaunch,
    existLaunchById,
    abortLaunchById
}