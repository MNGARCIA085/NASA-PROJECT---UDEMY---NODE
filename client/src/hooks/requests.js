
const API_URL = 'http://localhost:8000'

async function httpGetPlanets() {
  // TODO: Once API is ready.
  // Load planets and return as JSON.
  const response = await fetch (`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch (`${API_URL}/planets`);
  const fetchLaunches = await response.json();
  // ordeno por flightNumber
  return fetchLaunches.sort( (a,b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, 
            { 
              method:"post",
              headers:{
                "Content-Type":"application/json"
              },
              body: JSON.stringify(launch), // convierto launch a str
          })
  } catch(err) {
    return {ok:false}
  }
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};