const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const databaseName = 'grocery-db';
const collectionName = 'products';

const mongoDbUrl = process.env.MONGODB_URL;
// const mongoDbUrl = 'asdasdasd';
const settings = {
    useUnifiedTopology: true
};
console.log('mongoDbUrl: ' + mongoDbUrl);

let database;

const Connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoDbUrl, settings, function(err, client) {
            if(err) {
                reject(err);
            }
            else {
                console.log('SUCCESSFULLY CONNECTED TO DATABASE!');
                database = client.db(databaseName);
                resolve();
            }
        });
    });
};

const Insert = function(product) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);

        productCollection.insertOne(product, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('SUCCESSFULLY INSERTED A NEW DOCUMENT');
                resolve(res);
            }
        });
    });
};

const Find = function(product) {
    let productQuery = {};

    if(product) {
        productQuery = product;
    }

    return new Promise((resolve, reject) => {
        const productCollection = database.collection(collectionName);

        productCollection.find(productQuery).toArray(function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
};

module.exports = { Connect, Insert, Find };