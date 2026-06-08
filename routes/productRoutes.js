const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const authJWT = require('../middlewares/authJWT');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * Públicas
 */
router.get('/', getProducts);
router.get('/:id', getProductById);

/**
 * Solo admin
 */
router.post('/',authJWT,authorizeRole('admin'),createProduct);

router.put('/:id',authJWT,authorizeRole('admin'),updateProduct);

router.delete('/:id',authJWT,authorizeRole('admin'),deleteProduct);

module.exports = router;