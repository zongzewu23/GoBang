// db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        ca: fs.readFileSync('./us-east-2-bundle.pem').toString(),
        rejectUnauthorized: true, 
    },
});

export default pool;

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database at:', res.rows[0]);
    }
});