let user = '';
let password = '';

const express = require('express');
const { createPool } = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser({ extended: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cors());

const pool = createPool({
    host: 'localhost',
    user,
    password,
    database: 'record_store',
    port: 3306,
    insecureAuth: true,

})

app.listen(PORT, () => {
    console.log(`Service running on http://localhost:${PORT}`);
})

app.post('/api/users', (req, res) => {
    let query = 'INSERT INTO customers (first_name, last_name, address1, city, state, zip, phone, email, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [req.body.first_name, req.body.last_name, req.body.address1, req.body.city, req.body.state, req.body.zip, req.body.phone, req.body.email, req.body.country], (err, result) => {
        console.log(err, result);
    })
});

app.delete('/api/users/:id', async(req, res) => {

    const query = 'SELECT * FROM orders WHERE customer_id = ?';
    pool.query(query, [req.params.id], (err, result, fields) => {
        if (err) {
            res.json({ error: err });
            return;
        }
        let orderIds = result.map(id => id.order_id);
        let query2 = 'DELETE FROM order_items WHERE order_id IN (' + orderIds.toString() + ')';

        if (orderIds.length) {
            pool.query(query2, (err2, result2) => {
                if (err2) {
                    res.json({ error: err2 });
                    return;
                }
                let query3 = 'DELETE FROM orders WHERE customer_id = ?';
                pool.query(query3, [req.params.id], (err3, result3) => {
                    if (err3) {
                        res.json({ error: err3 });
                        return;
                    }
                    let finalQuery = 'DELETE FROM customers WHERE customer_id = ?';
                    pool.query(finalQuery, [req.params.id], (err4, result4) => {
                        if (err4) {
                            res.json({ error: err4 });
                            return;
                        }
                        res.json({ data: result4 });
                    })
                });
            })
        } else {
            let finalQuery = 'DELETE FROM customers WHERE customer_id = ?';
            pool.query(finalQuery, [req.params.id], (err4, result4) => {
                if (err4) {
                    res.json({ error: err4 });
                    return;
                }
                res.json({ data: result4 });
            })
        }
    })
})

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM customers';
    pool.query(query, (err, result) => {
        if (err) {
            res.json({ error: err });
            return;
        }
        res.json({ data: result });
    })
})