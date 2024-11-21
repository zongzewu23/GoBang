// db.js
import pkg from 'pg';
import fs from 'fs';
const { Pool } = pkg;

const pool = new Pool({
    user: 'Wu',
    host: 'gobang-db.cxaws4k40uln.us-east-2.rds.amazonaws.com',
    database: 'gobang_db',
    password: '20040622Wzz',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
    
});

export default pool;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database at:', res.rows[0]);
    }
});