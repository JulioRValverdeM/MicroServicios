const pool = require('../../config/db');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {

    try {

        const { username, email, password, role } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users
            (username,email,password_hash,role)
            VALUES ($1,$2,$3,$4)
            RETURNING id,username,email,role
            `,
            [
                username,
                email,
                passwordHash,
                role || 'cliente'
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};