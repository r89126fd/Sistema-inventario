/**
 * Archivo de rutas para la gestion de productos.
 * contiene endpoints para CRUD de productos y movimientos de stock.
 */
const express = require('express');
const database = require('../database/connection');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

/**
 * Metodo: GET
 * Ruta: /api/products
 */
router.get('/' ,(req, res) =>{
    const query = `
    SELECT p.id, p.name, p.price, p.stock, c.name AS category, p.status
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    `;
    database.query(query, (err, results) =>{
        if(err){
            return res.status(500).json({ error: 'Error al obtener productos', details: err.message});
        }
        res.status(200).json(results);
    });
});
/**
 * Metodo POST
 * Ruta: /api/products
 */
router.post('/', authMiddleware, (req, res) =>{
    const {name, price, stock, category_id} = req.body;

if(!name || !price || !stock || !category_id){
    return res.status(400).json({error: 'Todos los campos son obligatorios'});
}
const query = `INSERT INTO products (name, price, stock, category_id) VALUES (?,?,?,?)`;
database.query(query, [name, price, stock, category_id], (err, results) =>{
    if(err){
        return res.status(500).json({ error: 'Error al crear producto', details: err.message });
    }
    res.status(201).json({ message: 'Producto creado exitosamente', productoId: results.insertId});
    });
});
/**
 * Metodo PUT
 * Ruta: /api/products/:id
 */
router.put('/:id', authMiddleware, (req, res) =>{
    const id = req.params.id;
    const {name, price, stock, category_id} = req.body;

    if(!name || !price, !stock || !category_id){
        return res.status(400).json({ error: 'Todos los campos son obligatorios'});
    }
    const query = `
    UPDATE products
    SET name = ?, price = ?, stock = ?, category_id = ?, status = ?
    WHERE id = ?
    `;
    database.query(query, [name, price, stock, category_id, id], (err, results) =>{
        if(err){
            return res.status(500).json({ error: 'Error al actualzar producto', details: err.message});
        }
        if(results.affectedRows === 0) {
            return res.status(404).json( {error: 'Producto no encontrado'});
        }
        res.status(200).json({ message: 'Producto actualizado exitosamente'});
    });
});
/**
 * Eliminar un producto (borrado logico)
 * Metodo: DELETE
 * Ruta: /api/products/:id
 */
router.delete('/:id', authMiddleware, (req, res) =>{
    const id = req.params.id;
    const query = `UPDATE products SET status = 'inactive' WHERE id = ?`;
    database.query(query, [id,] ,(err, results) =>{
        if(err){
            return res.status(500).json({ error: 'Error al eliminar producto', details: err.message});
        }
        if(results.affectedRows === 0){
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado exitosamente'});
    });
});

module.exports = router;
