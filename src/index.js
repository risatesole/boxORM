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
        return this.atribute;
    }

    show() { // temporal solo para debug
        // console.log("Database: ",this.database);
        // console.log("Dialect: ",this.dialect);
        // console.log("storage location: ",this.storage);
        // console.log("model option: the id: ",this.modelOptions.id);
    }
}

module.exports = box;
