# Box ORM
# Box ORM - A Simple JavaScript ORM - box name is temporary will change it in the future

Disclaimer in development

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

## Basic Usage

### Define a Model

```js
import box from 'box';

// connection
const Box = new box({
    storage: './db.sqlite3',
    dialect: 'template',
    port: 88
},"myUsername","strongPassword");

// model
const User = Box.define(
    "user",
    {
        name: {
            type: 'STRING',
            allowNull: false
        },
        email: {
            type: 'STRING',
            allowNull: false
        },

        age: {
            type: 'INTEGER',
            allowNull: false
        },
        isalive{
          type: 'INTEGER',
          allowNull: false
        }
    },
    'anymodeloption'
);

User.insert({
    name: "allis",
    age: 25,
    eyeColor: "red",
    IsDominican: true
});
```

### CRUD Operations

```js
// Create
User.insert({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isalive: true
});
```

### Query Building



## Relationships

## Migrations


## Documentation



## Contributing


## License
No Licenses for now
