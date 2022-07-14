const http = require('http');

const { mongoConnect } = require('./services/mongo');

const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;


const server = http.createServer(app);


async function startServer(){
    // me conecto a mongo
    await mongoConnect();
    // cargo los planetas
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(` Listening in the port ${PORT}  `)
    })
}


startServer();
