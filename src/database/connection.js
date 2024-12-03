/**
 * Configuracion de la conexion a la base de datos MySQL
 * Este modulo establece la conexion a la base de datos `sistema_inventario`
 * y exporta el objeto de conexion para ser utilizado en otras partes de la aplicacion
 */
require('dotenv').config({ path: './src/.env'}); 
const mysql = require('mysql2');

// Configuracion de los parametros de conexion
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit: 0
});

// Establecer conexion a la base de datos 
pool.getConnection((err, connection) => {
    if(err){
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }else{
        console.log('Conexion exitosa');
        connection.release();
    }
});

module.exports = pool;