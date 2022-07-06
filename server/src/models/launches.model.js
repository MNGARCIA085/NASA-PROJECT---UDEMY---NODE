

// mapa que contendrá todos los lanzamientos
const launches = new Map();


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
launches.set(launch.fligthNumber,launch); // par clave-valor


//
function getAllLaunches(){
    return Array.from(launches.values());
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



// exportamos para que se pueda usar desde otro lado
module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchById,
    abortLaunchById
}