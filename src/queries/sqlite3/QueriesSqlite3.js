class QueriesSqlite3 {
    insertInto(tableName, insertData) {
        console.log(`insert into table "${tableName}" data: `, insertData);
        return false;
    }

}
module.exports = QueriesSqlite3;