const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const cors = require('cors');
const fs = require('fs');
const DAL = require('./dataAccessLayer');
const ObjectId = require('mongodb').ObjectId;
// require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

DAL.Connect();

// const products = require('./products.json');

app.get('/api/helloWorld', cors(), function(req, res) {
    res.send('Hello, World!');
});

// GET all products endpoint.
app.get('/api/products', cors(), async function(req, res) {
    const result = await DAL.Find();

    res.send(result);
});

// GET 1 product by ID endpoint.
app.get('/api/products/:id', cors(), async function(req, res) {
    const id = req.params.id;

    const product = {
        _id: ObjectId(id)
    };

    const result = await DAL.Find(product);

    if(result) {
        res.send(result);
    }
    else {
        res.send('No product with ID: ' + id + ' found!');
    }
});

app.put('/api/products/:id', async function(req, res) {
    const id = req.params.id;
    const product = {
        _id: ObjectId(id)
    };
    const newProduct = req.body;
    const updatedProduct = {
        $set: newProduct
    };

    const result = await DAL.Update(product, updatedProduct);
    res.send(result);
});

app.delete('/api/products/:id', function(req, res) {
    const id = req.params.id;

    delete products[id];

    const json = JSON.stringify(products);
    fs.writeFile('./products.json', json, () => {});

    res.send();
});

app.post('/api/products', function(req, res) {
    const product = req.body;

    if(product.name && product.price > 0) {
        // const myProduct = {
        //     name: product.name,
        //     price: product.price
        // };

        let id = uuidv4();

        while(products[id]) {
            // Generate a different id.
            id = uuidv4();
        }

        product.id = id;

        products[id] = product;

        const json = JSON.stringify(products);

        fs.writeFile('./products.json', json, () => {});

        res.status(201).send('Success');
    }
    else {
        res.send('Fail');
    }
});

app.listen(port, 
    () => console.log(`Example app listening on port ${port}!`)
);