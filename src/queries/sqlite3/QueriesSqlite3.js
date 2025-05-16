const sqlite3 = require('sqlite3').verbose();

class QueriesSqlite3 {
    constructor(database_path) {
        this.database_path = database_path;
        this.db = new sqlite3.Database(this.database_path);
        this.db.on('error', (err) => {
            console.error('Database error:', err);
        });
    }

    async createTable(tablename, attributes) {
        const mytable = tablename;

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
        const query = `CREATE TABLE IF NOT EXISTS ${mytable} (${myColumnDesign});`;
        
        try {
            await this.queryExecuter(query);
            return query;
        } catch (error) {
            console.error('Error creating table:', error.message);
            throw error;
        }
    }

    async insertInto(tableName, insertData) {
        const columns = Object.keys(insertData).join(', ');
        const values = Object.values(insertData)
            .map((val) =>
                typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : val
            )
            .join(', ');

        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;
        try {
            await this.queryExecuter(query);
            return query;
        } catch (error) {
            console.error('Error inserting data:', error.message);
            throw error;
        }
    }

    async queryExecuter(query) {
        return new Promise((resolve, reject) => {
            this.db.all(query, [], (err, rows) => {
                if (err) {
                    console.error('Query error:', err.message);
                    console.error('Failed query:', query);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = QueriesSqlite3;