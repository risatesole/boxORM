# Box ORM
# Box ORM - A Simple JavaScript ORM - box name is temporary will change it in the future

⚠ Disclaimer in development

Box is a lightweight, intuitive Object-Relational Mapping (ORM) library for JavaScript, designed to simplify database interactions with a clean, expressive syntax.

## Features

- **Simple API**: Easy-to-use methods for common CRUD operations
- **Database Agnostic**: Works with multiple SQL databases (SQLite, PostgreSQL, MySQL, etc.)
- **Type Support**: Full TypeScript support included
- **Relationships**: Handle one-to-one, one-to-many, and many-to-many relationships
- **Migrations**: Simple database schema management
- **Lightweight**: Minimal overhead with zero unnecessary dependencies

## Installation

```bash
# for the moment just install this repository this is not even in beta and some features are needed
```

## Example usage
```js
const Box = require('Box');

const box = new Box({
    storage: './db.sqlite3',
    dialect: 'template',
    port: 88
}, "myUsername", "strongPassword");

//models
const User = box.define("user", {
    name: { type: 'STRING', allowNull: true },
    age: { type: 'INTEGER', allowNull: false }
});

const Product = box.define("product", {
    name: { type: 'STRING', allowNull: false },
    price: { type: 'INTEGER', allowNull: false }
});

// Inserts
User.insert({
    name: "John",
    age: 30
});

Product.insert({
    name: "Laptop",
    price: 999
});
```


### Query Building



## Relationships

## Migrations


## Documentation



## Contributing


## License
No Licenses for now
