const pool = require('../config/db');

/**
 * GET /products
 */
const getProducts = async (req, res) => {
    try {

        const result = await pool.query(
            'SELECT * FROM products ORDER BY id'
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error al consultar productos'
        });
    }
};

/**
 * GET /products/:id
 */
const getProductById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: 'Error al consultar producto'
        });
    }
};

/**
 * POST /products
 */
const createProduct = async (req, res) => {

    try {

        const { name, price } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: 'El nombre es obligatorio'
            });
        }

        if (!price || Number(price) <= 0) {
            return res.status(400).json({
                message: 'El precio debe ser mayor que cero'
            });
        }

        const result = await pool.query(
            `
            INSERT INTO products(name, price)
            VALUES ($1, $2)
            RETURNING *
            `,
            [name, price]
        );

        res.status(201).json({
            message: 'Producto creado',
            product: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error al crear producto'
        });
    }
};

/**
 * PUT /products/:id
 */
const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;
        const { name, price } = req.body;

        const exists = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (exists.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: 'El nombre es obligatorio'
            });
        }

        if (!price || Number(price) <= 0) {
            return res.status(400).json({
                message: 'El precio debe ser mayor que cero'
            });
        }

        const result = await pool.query(
            `
            UPDATE products
            SET
                name = $1,
                price = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
            `,
            [name, price, id]
        );

        res.status(200).json({
            message: 'Producto actualizado',
            product: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error al actualizar producto'
        });
    }
};

/**
 * DELETE /products/:id
 */
const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM products
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            message: 'Producto eliminado'
        });

    } catch (error) {

        res.status(500).json({
            message: 'Error al eliminar producto'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};