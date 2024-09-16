const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const url = 'mongodb://localhost:27017';
const dbName = 'inventoryDB';

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const products = db.collection('products');

    app.get('/api/products', (req, res) => {
        products.find({}).toArray((err, items) => {
            if (err) throw err;
            res.json(items);
        });
    });

    app.post('/api/products', (req, res) => {
        const product = req.body;
        products.insertOne(product, (err, result) => {
            if (err) throw err;
            res.status(201).send(result);
        });
    });

    app.put('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const updatedProduct = req.body;
        products.updateOne({ id }, { $set: updatedProduct }, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

    app.delete('/api/products/:id', (req, res) => {
        const id = parseInt(req.params.id);
        products.deleteOne({ id }, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
