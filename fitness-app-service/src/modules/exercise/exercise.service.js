const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const commonService = require('../common/common.service')

const dbTable = 'fit_exercise';

function getAll(req, res) {
    commonService.getAll(req, res, dbTable);
}

function getById(req, res) {
    commonService.getById(req, res, dbTable);
}

function deleteById(req, res) {
    commonService.deleteById(req, res, dbTable);
}

function createRecord(req, res) {
    commonService.createElement(req, res, dbTable)
}

function updateRecord(req, res) {

    let params = req.body;
    const itemCheckQuery = `SELECT * FROM ${dbTable} WHERE id = ?`;

    mysqlConnection.query(itemCheckQuery, params.id, (err, result) => {
        if (!err) {
            const isEmpty = Object.keys(result).length === 0; //This returns true or false

            if (!isEmpty) {
                commonService.updateElement(req, res, dbTable);
            } else {
                res.send(`id: ${params.id} does not exist!`);
            }
        } else {
            console.log(err);
        }
    })
}





module.exports = {
    getAll,
    getById,
    deleteById,
    createRecord,
    updateRecord
}