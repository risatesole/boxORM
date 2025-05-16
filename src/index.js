class box {
    constructor(database, username, password) {
        this.database = database.database;
        this.username = database.username;
        this.port = database.port;
        this.dialectOptions = database.dialectOptions;
        this.dialect = database.dialect;
        this.storage = database.storage;
        this.username = username;
        this.password = password;
    }

    define(tablename, atribute, modelOptions) {
        // aqui van los modelos
        this.tablename = tablename; //string nombre de la tabla
        this.atribute = atribute; // json
        this.modelOptions = modelOptions; //json too
        // return this.atribute.name.hi; // todo: list all the row names and types (atributes) y destinarlos a las diferentes tipos de datos string int boolean etc
        return this;
    }

    insert(insert_data) {
        this.atribute;
        const resoult = this.validateDataAgainstSchema(
            insert_data,
            this.atribute
        );
        if (resoult.isValid == false) {
            return 'invalid data';
        } else {
            if (this.dialect == 'sqlite3') {
                // todo: put insert sqlite3 logic here
                return 'valid data - in sqlite3';
            } else if (this.dialect == 'mysql') {
                // todo: put mysql insert logic here
                return 'valid data - in mysql'
            } else if (this.dialect == 'mariadb') {
                // todo: put mariadb insert logic here
                return 'valid data - in mariadb'
            }else {
                return 'not dbms recognised';
            }
            return 'just valid data no dbms recognised';
        }
    }

    getIntAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'INTEGER') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }
    getStringAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'STRING') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }
    getBooleanAtributes() {
        for (const [key, value] of Object.entries(this.atribute)) {
            if (value.type === 'BOOLEAN') {
                // Check if allowNull is TRUE
                console.log(key, value); // Print the property name and its definition
            }
        }
    }

    validateDataAgainstSchema(data, schema) { //got help from the llm for this feel just to do this feel ashamed
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

    show() {
        // temporal solo para debug
        // console.log("Database: ",this.database);
        // console.log("Dialect: ",this.dialect);
        // console.log("storage location: ",this.storage);
        // console.log("model option: the id: ",this.modelOptions.id);
    }
}

module.exports = box;
