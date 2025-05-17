const box = require('box');
const sqlite3 = require('sqlite3').verbose();

const Box = new box({
    storage: './db.sqlite3',
    dialect: 'template',
    port: 88
    
},"myUsername","strongPassword");

const User = Box.define(
    "user",
    {
        name: {
            type: 'STRING',
            allowNull: true,
        },
        age: {
            type: 'INTEGER',
            allowNull: false,
        },
        eyeColor: {
            type: 'STRING',
            allowNull: true,
        },
        IsDominican: {
            type: 'BOOLEAN',
            allowNull: false
        }
    },
    'anymodeloption'
);





const Shoe = Box.define(
    "shoe",
    {
        size: {
            type: 'INTEGER',
            allowNull: true,
        },
        modelname: {
            type: 'STRING',
            allowNull: false,
        },
        color: {
            type: 'STRING',
            allowNull: true,
        }
    },
    'anymodeloption'
);

// User.insert({
//     name: "allis",
//     age: 25,
//     eyeColor: "red",
//     IsDominican: true
// });




// try{
// await User.insert({
//     name: "John",
//     age: 25,
//     eyeColor: "brown",
//     IsDominican: true
// });
// }catch{
//     console.error(err);
    
// }






// // function myquery(tablename, ColumnDesign) {

// //     const mytable = tablename;
    
// //     // Process each column definition
// //     const columns = Object.entries(ColumnDesign).map(([columnName, columnDef]) => {
// //         let columnQuery = `${columnName} `;
        
// //         // Map JavaScript types to SQLite types
// //         switch(columnDef.type.toUpperCase()) {
// //             case 'STRING':
// //                 columnQuery += 'TEXT';
// //                 break;
// //             case 'INTEGER':
// //                 columnQuery += 'INTEGER';
// //                 break;
// //             case 'BOOLEAN':
// //                 columnQuery += 'INTEGER'; // SQLite doesn't have BOOLEAN, use INTEGER (0 or 1)
// //                 break;
// //             default:
// //                 columnQuery += 'TEXT'; // Default to TEXT if type not recognized
// //         }
        
// //         // Add constraints
// //         if (columnName.toLowerCase() === 'id') {
// //             columnQuery += ' PRIMARY KEY AUTOINCREMENT';
// //         }
        
// //         if (columnDef.allowNull === false) {
// //             columnQuery += ' NOT NULL';
// //         }
        
// //         return columnQuery;
// //     });
    
// //     // Join all column definitions with commas
// //     const myColumnDesign = columns.join(', ');
    
// //     // Construct the final query
// //     const query = `CREATE TABLE IF NOT EXISTS ${mytable} (${myColumnDesign});`;
// //     console.log(query);
// //     return query;
// // }

// // user = {
// //     name: {
// //         type: 'STRING',
// //         allowNull: true,
// //     },
// //     age: {
// //         type: 'INTEGER',
// //         allowNull: false,
// //     },
// //     eyeColor: {
// //         type: 'STRING',
// //         allowNull: true,
// //     },
// //     IsDominican: {
// //         type: 'BOOLEAN',
// //         allowNull: false,
// //     },
// // };

// // myquery('users', user);







// listOfSuppourtedDialects=["english","french","italian","spanish"];
// dialectUsing="spanish";

// if (!listOfSuppourtedDialects.includes(dialectUsing)) {
//     console.log(` is not in the array`);
// }else {}