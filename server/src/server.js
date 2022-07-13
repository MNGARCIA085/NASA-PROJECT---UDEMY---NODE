const http = require('http');
const mongoose = require('mongoose');


const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;


const MONGO_URL = 'mongodb+srv://nasa-api:BYpqoDmIMDTRbVMZ@micluster.9kyr5.mongodb.net/nasa?retryWrites=true&w=majority';



const server = http.createServer(app);


async function startServer(){
    await mongoose.connect(MONGO_URL);

    
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(` Listening in the port ${PORT}  `)
    })
}



// chequeo la conexión
mongoose.connection.once('open', ()=> {
    console.log('MongoDB ready');
})


// si hay errores
mongoose.connection.on('error', (err) => {
    console.error(err);
})


startServer();
