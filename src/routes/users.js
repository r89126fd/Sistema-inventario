/**
 * Archivo de rutas para la gestion de usuarios.
 * Contiene los endpoints para manejar opereaciones CRUD y borrado logico de los usuarios
 */
const express = require('express');
const database = require('../database/connection'); // conexion a la base de datos
const authMiddleware = require ('../middlewares/authMiddlewares');
const router = express.Router(); // instancia de un router para organizar las rutas

/**
 * Metodo: GET
 * Ruta: /api/users
 * Rotorna lista de usuarios con su informacion y rol asociado
 */
router.get('/', (req, res) => {
    const query = `SELECT users.id, users.name, users.email, users.username,roles.name AS role, users.status
                   FROM users
                   JOIN roles ON users.role_id = roles.id
                   `;

    database.query(query, (err, results) => {
        if(err){
            return res.status(500).json({error: 'Error al obtener los usuarios', details: err.message});
        }
        res.status(201).json(results)
    });
});
/**
 * Metodo: POST
 * Ruta: /api/users
 * Requiere autenticacion mediante JWT
 * Crea un nuevo usuario en la base de datos
 */
router.post('/',authMiddleware, (req, res) => {
    const {name, email, username, password, role_id} = req.body;

    if(!name || !email || !username || !password || !role_id){
        return res.status(400).json({error: 'Todos los campos son obligatorios'});
    }

    const query = `INSERT INTO users (name, email, username, password, role_id) VALUES (?, ?, ?, ?, ?)`
    database.query(query, [name, email, username, password, role_id], (err, results) =>{
        if(err){
            return res.status(500).json({err: 'Error al crear usuario', details: err.message});
        }
        res.status(201).json({message: 'Usuario creado exitosamente', userId: results.insertId});
    });
});

/**
 * Metodo: PUT
 * Ruta: /api/users/:id
 * Requiere autenticacion mediante jwt
 * Actualiza la informacion de un usuario existente en la base de datos
 */
router.put('/:id', authMiddleware,(req, res) =>{
    const id = req.params.id;
    const {name, email, username, password, role_id} = req.body;

    if(!name || !email || !username || !password || !role_id){
        return res.status(400).json({error: 'Todos los campos son obligarios'});
    }
    const query = `UPDATE users SET name = ?, email = ?, username = ? ,password = ?, role_id = ? WHERE id = ?`;
    database.query(query, [name, email, username, password, role_id, id], (err, results) =>{

        if(err){
            return res.status(500).json({err:'Error al actulizar usuario', details: err.message});
        }
        // verificar si algun registro fue afectado
        if (results.affectedRows === 0){
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        res.status(201).json({message: 'Usuario actualizado exitosamente', userId: results.userId});

    });
});
/**
 * Desactivar un usuario (borrado logico)
 * Metodo: PUT
 * Ruta: /api/users/:id/deactivate
 * Requiere autenticacion mediante JWT.
 * Cambia el estado del usuario a 'inactive'.
 */
router.put('/:id/deactivate', authMiddleware,(req, res) => {
    const id = req.params.id;
    const query = `UPDATE users SET status = 'inactive' WHERE id = ?`;

    database.query(query, [id], (err, results) => {
        if(err){
            return res.status(500).json({err: 'Error al desactivar usuario.', details: err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({ error: 'Usuario no encontrado.'})
        }
        res.status(200).json({message: 'Usuario desactivado exitosamente.'})
    });
});
/**
 * activar usuario 
 * Metodo: PUT
 * Ruta: /api/users/:id/activate
 * Requiere autenticacion mediante JWT.
 * Cambia el estado del usuario a 'active'.
 */
router.put('/:id/activate', authMiddleware,(req, res) => {
    const id = req.params.id;
    const query = `UPDATE users SET status = 'active' WHERE id = ?`;

    database.query(query, [id], (err, results) => {
        if(err){
            return res.status(500).json({err: 'Error al activar usuario.', details: err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({ error: 'Usuario no encontrado.'})
        }
        res.status(200).json({message: 'Usuario activado exitosamente.'})
    });
});

module.exports = router;

 