const launchesDatabase = require('./launches.mongo');
const planets =  require('./planets.mongo');
const axios = require('axios');


const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';


// valor por defecto para el número de lanzamiento
const DEFAULT_FLIGHT_NUMBER = 100;

//
async function getAllLaunches(skip,limit){
    return await launchesDatabase.find( {}, {'_id':0, '__v':0} )
    .sort({ flightNumber : 1  })
    .skip(skip)
    .limit(limit);
}
  
  
  // encontrar un lanzamiento
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

// planficar un lanzamiento
  async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
      keplerName: launch.target,
    });
  
    if (!planet) {
      throw new Error('No matching planet found');
    }
  
    const newFlightNumber = await getLatestFlightNumber() + 1;
  
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['Zero to Mastery', 'NASA'],
      flightNumber: newFlightNumber,
    });
  
    await saveLaunch(newLaunch);
  }
  


//  cargar los lanzamientos desde la API de Space X
async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            'customers': 1
          }
        }
      ]
    }
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  }
}


// saber si se cargó el primer lanzamiento
// si es así posiblemente estén todos
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
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
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}


// exportamos para que se pueda usar desde otro lado
module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}