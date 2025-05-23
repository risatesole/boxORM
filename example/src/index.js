const Box = require('Box');

const box = new Box({
    storage: './db.sqlite3',
    dialect: 'template',
    port: 88
}, "myUsername", "strongPassword");

// Define models
const User = box.define("user", {
    name: { type: 'STRING', allowNull: true },
    age: { type: 'INTEGER', allowNull: false }
});

const Product = box.define("product", {
    name: { type: 'STRING', allowNull: false },
    price: { type: 'INTEGER', allowNull: false }
});

// Insert records - using the MODEL's insert method, not the ORM's
User.insert({
    name: "John",
    age: 30
});

Product.insert({
    name: "Laptop",
    price: 999
});

