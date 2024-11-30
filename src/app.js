/**
 * Archivo principal de al aplicacion.
 * Configura el servidor Express, establece las rutas y activa el servidor.
 */
const express = require('express'); 
const cors = require('cors'); 
const database = require('./database/connection'); 
const usersRoutes = require('./routes/users'); 
const authRoutes = require('./routes/auth'); 

const app = express(); 

app.use(cors());
app.use(express.json());

// Configuracion de rutas
app.use('/api/users', usersRoutes); // Rutas para la gestion de usuarios
app.use('/api/auth', authRoutes); // Rutas para la autenticacion

app.get('/', (req, res) => { // Ruta de prueba
    res.send('servidor corriendo!');
});

const Port = 3000;
app.listen(Port,() => {
    console.log(`Server corriendo en http://localhost:${Port}`);
});
