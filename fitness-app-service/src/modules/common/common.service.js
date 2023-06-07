const { callbackPromise } = require('nodemailer/lib/shared');
const mysqlConnection = require('../../../connection');

const selectAll = `SELECT * FROM `;
const whereCls = ` WHERE id = `;
const deleteCls = `DELETE FROM `;

function getAll(req, res, tableName) {
    let getAllQuery = selectAll + tableName;

    mysqlConnection.query(getAllQuery, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
}

function getById(req, res, tableName) {
    let getByIdQuery = selectAll + tableName + whereCls + req.params.id;

    mysqlConnection.query(getByIdQuery, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    })
}

function deleteById(req, res, tableName) {
    let deleteQuery = deleteCls + tableName + whereCls + req.params.id;

    mysqlConnection.query(deleteQuery, (err, rows, fields) => {
        if (!err) {
            res.send(`Record id = ${req.params.id}, deleted sucessfully!`);
        } else {
            console.log(err);
        }
    })
}

function createElement(req, res, tableName) {
    const params = req.body;

    mysqlConnection.query(`INSERT INTO ${tableName} SET ?`, params, (err, rows, fields) => {
        if (!err) {
            res.send("Record added sucessfully");
        } else {
            console.log(err);
        }
    })
}

// Check whether the item exists, before use this method
function updateElement(req, res, tableName) {

    // for (let [key, value] of Object.entries(req.body)) {
    //     console.log(`${key} : ${value}`);
    // }

    let updateDto = ``

    let itemList = [];

    for (let key of Object.keys(req.body)) {
        if (key == 'id') continue;
        itemList.push(`${key} = '${req.body[key]}'`)
        itemList.push(',')
    }

    itemList.pop();

    for (let item of itemList) {
        updateDto = updateDto + item
    }

    let query =
        `UPDATE ${tableName}
        SET
        ${updateDto}
        WHERE id = ${req.body.id}`

    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            res.send("Record updated sucessfully");
        } else {
            console.log(err);
        }
    })

}




module.exports = {
    getAll,
    getById,
    deleteById,
    createElement,
    updateElement    
}