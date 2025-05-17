// const QueriesSqlite3 = require('./queries/sqlite3/QueriesSqlite3');

/**
 * Main ORM abstraction class.
 * Hello user Henry here hope you are doing well
 * @warning At the moment im creating this orm for now treat it like everything is going to explode
 * do not trust blind folded in this code ;)
 * @todo Refactor this to be more maintainable
 * @class box - temporary name to this orm class
 * @property {Object} database - Database name or connection logic
 * @property {string} username - Database username
 * @property {string} password - Database password
 * @property {number} port - Connection port
 * @property {Object} dialectOptions - Additional dialect-specific options
 * @property {string} dialect - Database dialect (sqlite3, mysql, template)
 * @property {string} storage - Storage path (for file-based databases)
 * @property {Object} databaseLogic - The active database handler instance
 *
 */
class box {
    /**
     *
     */
    // static listOfSupportedDialects = ['sqlite3', 'mysql', 'template'];

    /**
     * constructor stablishes the connection to this class
     * @constructor constructor for orm (box)
     * @param {{port:integer,dialect:string,storage:string,dialectOptions:json}} database
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
        this.connect();
    }
    /**
     * This method Establishes a connection to the database based on the configured dialect.
     * Checks if the dialect is supported then checks if the credentials are not emty before
     * attempting to connect. It does that by setting the appropriate database logic handler
     * based on the chosen dialect. Currently only supports 'template' dialect - other dialects
     * will log an error.
     * @method connect
     * @returns {void}
     * @throws Will log an error to console if:
     *   - The dialect is not supported (in listOfSupportedDialects)
     *   - The dialect is not implemented
     */
    connect() {
        // check if dialect is unsuppourted:
        if (!this.listOfSupportedDialects.includes(this.dialect)) {
            console.log(`error: ${this.dialect} is not a supported dialect.`);
            return;
        } else {
            console.log(`valid dialect`);
        }

        // set database based in user dialect
        if (this.dialect == 'template') {
            // console.log('connection to template');
            this.databaseLogic = new dbmsTemplate(this); // calling class dbmsTemplate as if is a dbms and putting in this.databaseLogic
        } else {
            console.log('this is an error');
        }
    }

    /**
     * @param {string} tablename
     * @param {{atributeName:{type:string,allowNull:boolean}}} atribute
     * @param {json} modelOptions  - not implemented jet
     * @returns {this} Returns the instance for method chaining.
     */
    define(tablename, atribute, modelOptions) {
        this.databaseLogic.define(tablename, atribute, modelOptions);
        return this;
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
    /**
     * @method show - debug function to be called to test some aspects of the code
     */
    show() {
        // temporal solo para debug
        // console.log("Database: ",this.database);
        // console.log("Dialect: ",this.dialect);
        // console.log("storage location: ",this.storage);
        // console.log("model option: the id: ",this.modelOptions.id);
    }
}

/**
 * this class can be used to copy and paste. this class serves as templete for new dbms that should implement those functions
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
        // console.log('Hello from template');
        // console.log(this.passme);
        this.connect();
    }
    /**
     * @method connect
     * @description method to connect to the dbms
     * @returns {void}
     */
    connect() {
        console.log('executing connection logic');
        console.log('data about connection: ');
        console.log({
            storage: this.passme.storage,
            port: this.passme.password,
            dialect: this.passme.dialect,
            dialectOptions: this.passme.dialectOptions,
        });
        this.line();
    }
    /**
     * @method line
     * @description just prints a line for easy to read in the terminal from where is called
     * @returns {void}
     */
    line() {
        console.log('-------------------------------------------------------');
    }
    /**
     * 
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
            await this.queryExecuter(query);
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
    define(tablename, atribute, modelOptions) {
        if (tablename == null) {
            console.log('no tablename defined');
        }
        this.atribute = atribute;
        console.log('fuck im here: ', this.atribute);
        // console.log("definint dbms table");
        // console.log("table name: ",tablename);
        // console.log("atributes: ",atribute);
        // console.log("modelOptions: ",modelOptions);
        this.createTable(tablename, atribute);
        this.tableName = tablename;
        return this;
    }

    /**
     * @method insert - insert data into database
     * @param {*} insertData 
     * @returns 
     */
    async insert(insertData) {
        // const columns = Object.keys(insertData).map(escapeIdentifier).join(', ');
        console.log(Object.keys(insertData));
        console.log(this.columns);
        // console.log(insertData);

        // Process values safely

        const values = [];
        for (const val of Object.values(insertData)) {
            if (val === null) {
                values.push('NULL');
            } else if (typeof val === 'string') {
                values.push(`'${val.replace(/'/g, "''")}'`);
            } else if (typeof val === 'boolean') {
                values.push(val ? 1 : 0);
            } else {
                values.push(val);
            }
        }
        const valuesString = values.join(', ');

        // Build query with semicolon
        const query = `INSERT INTO ${this.tableName} (${this.columns}) VALUES (${valuesString});`;

        try {
            await this.queryExecuter(query);
            return query;
        } catch (error) {
            console.error('Error inserting data:', error.message);
            throw error;
        }
    }

    /**
     * @method queryExecuter - executed the query in the maramether query in the database
     * @param {*} query - the query that goes to the database
     * @returns {Promise<void>} A resolved Promise with no return value.
     */
    async queryExecuter(query) {
        console.log('executing query: ');
        console.log(query);
        this.line();
        // Simulate async operation
        return Promise.resolve();
    }

    /**
     * @todo make it just return just the name of the columns
     * @returns {json} returns a json with the columns and atributes of the table
     */
    getColumns() {
        console.log('atributes: ', this.atribute);
        return this.atribute;
    }
}

/**
 * The main orm export
 * @module box-orm
 * @exports {Box} - box orm
 */
module.exports = box;
