/**
 * Configuracion de la conexion a la base de datos MySQL
 * Este modulo establece la conexion a la base de datos `sistema_inventario`
 * y exporta el objeto de conexion para ser utilizado en otras partes de la aplicacion
 */
const mysql = require('mysql2');

// Configuracion de los parametros de conexion
const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sistema_inventario'

});

// Establecer conexion a la base de datos 
database.connect((err) => {
    if(err){
        console.log('Error al conectar a la base de datos:', err.message);
        return;
    }else{
        console.log('Conexion exitosa');
    }
});

module.exports = database;