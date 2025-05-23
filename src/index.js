/**
 * Main ORM class.
 * Hello user Henry here hope you are doing well
 * @warning At the moment im creating this orm for now treat it like everything is going to explode
 * do not trust blind folded in this code ;)
 * @class box - temporary name to this orm class
 */
class Box {
    // static listOfSupportedDialects = ['sqlite3', 'mysql', 'template'];

    /**
     * @constructor boxConstructor - constructor for orm (box)
     * @param {json} database
     * @param {String} username
     * @param {string} password
     */
    constructor(database, username, password) {
        this.database = database.database;
        // this.username = database.username;
        this.port = database.port;
        this.dialectOptions = database.dialectOptions;
        this.dialect = database.dialect;
        this.storage = database.storage;
        this.username = username;
        this.password = password;
        this.listOfSupportedDialects = ['sqlite3', 'mysql', 'template'];
        this.models = {};
        this.connect();
    }

    /**
     * This method Establishes a connection to the database based on the configured dialect.
     * Checks if the dialect is supported then checks if the credentials are not emty before
     * attempting to connect. It does that by setting the appropriate database logic handler
     * based on the chosen dialect. Currently only supports 'template' dialect - other dialects
     * will log an error.
     * @method connect - connect to dbms.
     * @returns {void}
     * @throws Will log an error to console if:
     *   - The dialect is not supported (in listOfSupportedDialects)
     *   - The dialect is not implemented
     */
    connect() {
        // check if dialect is unsuppourted:
        if (!this.listOfSupportedDialects.includes(this.dialect)) {
            // console.log(`error: ${this.dialect} is not a supported dialect.`);
            throw new Error(
                `error: ${this.dialect} is not a supported dialect.`
            );
        } else {
            // console.log(`valid dialect`);
        }

        if (this.dialect == 'template') {
            this.databaseLogic = new dbmsTemplate(this); // calling class dbmsTemplate as if is a dbms and putting in this.databaseLogic
        } else {
            console.log('this is an error');
        }
    }

    /**
     * @param {string} tablename
     * @param {{json}} atribute
     * @param {json} modelOptions  - not implemented jet
     * @returns {this} Returns the instance for method chaining.
     */
    define(tablename, atribute, modelOptions) {
        const model = new Model(this, tablename, atribute, modelOptions);
        this.models[tablename] = model;
        this.tableName= tablename;
        this.databaseLogic.define(tablename, atribute, modelOptions);
        return model;
    }

    /**
     *
     * @returns {this} Returns the instance for method chaining
     */
    duck() {
        console.log('Hello?');
        return this;
    }

    /**
     * @description calls the method for the respective definition of chosen dbms
     * @param {json} insert_data - data to insert into the table
     */
    async insert(insert_data) {
        // todo: fix why still the error of table name is the last created model
        console.log(this.tableName);
        this.databaseLogic.insert(insert_data);
    }

    /**
     * @method getIntAtributes - list all the int atributes in the used model
     */
    getIntAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'INTEGER') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }

    /**
     * @method getStringAtributes - list all the string atributes in the used model
     */
    getStringAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'STRING') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }

    /**
     * @method getBooleanAtributes - list all the boolean atributes in the used model
     */
    getBooleanAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'BOOLEAN') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }

    /**
     * @todo fix some errors
     * @method validateDataAgainstSchema - checks if the data that is going to be inserted in the database is valid
     */
    validateDataAgainstSchema(data, schema) {
        //got help from the llm for this feel just to do this feel ashamed
        // Check for missing required fields

        for (const [field, config] of Object.entries(schema)) {
            if (!config.allowNull && !(field in data)) {
                return {
                    isValid: false,
                    error: `Missing required field: ${field}`,
                };
            }
        }

        // Check for extra fields not in schema
        for (const field in data) {
            if (!(field in schema)) {
                return { isValid: false, error: `Unexpected field: ${field}` };
            }
        }

        // Check data types
        for (const [field, value] of Object.entries(data)) {
            const config = schema[field];
            if (value === null || value === undefined) {
                if (!config.allowNull) {
                    return {
                        isValid: false,
                        error: `Field ${field} cannot be null`,
                    };
                }
                continue;
            }

            let isValidType;
            switch (config.type) {
                case 'STRING':
                    isValidType = typeof value === 'string';
                    break;
                case 'INTEGER':
                    isValidType = Number.isInteger(value);
                    break;
                case 'BOOLEAN':
                    isValidType = typeof value === 'boolean';
                    break;
                default:
                    return {
                        isValid: false,
                        error: `Unknown type ${config.type} for field ${field}`,
                    };
            }

            if (!isValidType) {
                return {
                    isValid: false,
                    error: `Field ${field} should be ${
                        config.type
                    }, got ${typeof value}`,
                };
            }
        }

        return { isValid: true };
    }
}

/**
 * Model class representing a database table
 * @class Model
 */
class Model {
    /**
     * Creates a new Model instance
     * @constructor
     * @param {box} orm - The ORM instance
     * @param {string} tablename - Table name
     * @param {Object} attributes - Table attributes
     * @param {Object} [modelOptions] - Model options
     */
    constructor(orm, tablename, attributes, modelOptions) {
        this.orm = orm;
        this.tablename = tablename;
        this.attributes = attributes;
        this.modelOptions = modelOptions || {};
        this.tableColumns = Object.keys(attributes);
        this.initialize();
    }

    /**
     * Initializes the model (creates table in database)
     * @method initialize
     * @private
     * @returns {void}
     */
    initialize() {
        this.orm.databaseLogic.createTable(this.tablename, this.attributes);
    }

    /**
     * Inserts data into the model's table
     * @method insert
     * @param {Object} data - Data to insert
     * @returns {Promise<void>}
     * @throws {Error} If validation fails
     */
    async insert(data) {
        const validation = this.orm.validateDataAgainstSchema(data, this.attributes);
        if (!validation.isValid) {
            throw new Error(validation.error);
        }
        return this.orm.databaseLogic.insert(this.tablename, data, this.tableColumns);
    }

    // ... (other model methods can be added here)
}

/**
 * Database handler template class
 * @class dbmsTemplate
 * @property {json} passme - this function is called by function  {@link box}
 */
class dbmsTemplate {
    /**
     * Creates a new database handler instance.
     * @constructor
     * @param {box} passme - The parent ORM instance containing:
     *   - Database configuration (`dialect`, `storage`, etc.)
     *   - Connection credentials (`username`, `password`)
     * @example
     * // Called internally by box.connect():
     * new dbmsTemplate(ormInstance);
     * @see {@link box#connect} Where this constructor is invoked.
     */
    constructor(passme) {
        this.passme = passme;
        this.connect();
    }
    /**
     * @method connect
     * @description method to connect to the dbms
     * @returns {void}
     */
    connect() {
        console.log('▪ executing connection logic.');
        // console.log('data about connection: ');
        // console.log({
        //     storage: this.passme.storage,
        //     port: this.passme.password,
        //     dialect: this.passme.dialect,
        //     dialectOptions: this.passme.dialectOptions,
        // });
    }

    /**
     * creates table
     * @param {string} tablename  - name of the table to create
     * @param {json} attributes - the atributes for create the database
     * @returns {void}
     */
    async createTable(tablename, attributes) {
        const columns = Object.entries(attributes).map(
            ([columnName, columnDef]) => {
                let columnQuery = `${columnName} `;

                switch (columnDef.type.toUpperCase()) {
                    case 'STRING':
                        columnQuery += 'TEXT';
                        break;
                    case 'INTEGER':
                        columnQuery += 'INTEGER';
                        break;
                    case 'BOOLEAN':
                        columnQuery += 'INTEGER';
                        break;
                    default:
                        columnQuery += 'TEXT';
                }

                if (columnName.toLowerCase() === 'id') {
                    columnQuery += ' PRIMARY KEY AUTOINCREMENT';
                }

                if (columnDef.allowNull === false) {
                    columnQuery += ' NOT NULL';
                }

                return columnQuery;
            }
        );

        const myColumnDesign = columns.join(', ');
        const query = `CREATE TABLE IF NOT EXISTS ${tablename} (${myColumnDesign});`;

        try {
            await this.queryExecuter(query); // execute the query
            return query;
        } catch (error) {
            console.error('Error creating table:', error.message);
            throw error;
        }
    }

    /**
     * @todo model options
     * @method define
     * @description defines the way a table should be based in the table model
     * @param {string} tablename
     * @param {json} atribute
     * @param {json} modelOptions - not implemented jet but must put a placeholder for now
     * @returns {void}
     * @see {@link box#connect}
     */
    define(tablename, attributes, modelOptions) {
        if (!tablename) throw new Error('Table name is required');
        this.createTable(tablename, attributes);
        return this;
    }

    /**
     * @method insert - insert data into database
     * @param {*} insertData
     * @returns {void}
     */
    async insert(tablename, insertData, tableColumns) {
        const values = Object.values(insertData).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? 1 : 0;
            return val;
        });

        const query = `INSERT INTO ${tablename} (${tableColumns.join(', ')}) VALUES (${values.join(', ')});`;
        await this.queryExecuter(query);
        return query;
    }

    /**
     * @method queryExecuter - executed the query in the maramether query in the database
     * @param {*} query - the query that goes to the database
     * @returns {Promise<void>} A resolved Promise with no return value.
     */
    async queryExecuter(query) {
        console.log('----------------');
        console.log('▪ executing query:');
        console.log(query);
        return Promise.resolve();
    }
}

module.exports = Box;