const express = require('express');
const router = express.Router();
const mysqlConnection = require('../../../connection');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const commonService = require('../common/common.service')

dotenv.config();
const dbTable = 'fit_user';

// Send mail method
async function sendMail(Mailinfo) {

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER_HOST,
        port: process.env.MAIL_SERVER_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.sendMail(Mailinfo, (error, result) => {
        if (error) {
            return console.log(error);
        } else {
            console.log('Mail sent successfully!');
        }
    })
}

// Create user
async function createUser(req, res) {

    try {
        let params = req.body;
        let userArray;
        const hashedPassword = await bcrypt.hash(req.body.password, 5);
        const userNameCheckQuery = 'SELECT user_name FROM fit_user WHERE user_name = ?';
        const createUserQuery = 'INSERT INTO fit_user SET ?';

        const userObject = {
            user_name: params.user_name,
            password: hashedPassword,
            email: params.email
        };

        mysqlConnection.query(userNameCheckQuery, params.user_name, (err, results) => {
            if (!err) {
                userArray = results;
                const isEmpty = Object.keys(userArray).length === 0;

                if (isEmpty) {
                    mysqlConnection.query(createUserQuery, userObject, async (err, result) => {
                        if (!err) {

                            let Mailinfo = {
                                from: `"Revolake Team" <${process.env.MAIL}>`,
                                to: userObject.email,
                                subject: "Greetings From Team Revolake!",
                                html: "<b>This is to confirm that your fitness app account created successfully and your email has been verified.</b>",
                            };
                            // await sendMail(Mailinfo);
                            res.send("New user created sucessfully!");
                        } else {
                            res.send('User creation failed!');
                        }
                    })
                } else {
                    res.status(400).send('This user name already exists! Try another');
                }
            } else {
                console.log(err);
            }
        })

    } catch {
        res.status(500).send('Internal Server Error!');
    }
}

// user login
async function loginUser(req, res) {

    try {
        let params = req.body;
        let userArray;
        const userNameCheckQuery = 'SELECT * FROM fit_user WHERE user_name = ?';

        mysqlConnection.query(userNameCheckQuery, params.user_name, async (err, result) => {
            if (!err) {
                userArray = result;
                const isEmpty = Object.keys(userArray).length === 0;

                if (!isEmpty) {
                    let passwordMatch = await bcrypt.compare(params.password, result[0].password);
                    if (passwordMatch == true) {
                        res.status(200).send('Login Success!');
                    } else {
                        res.status(400).send('Password Incorrect!');
                    }
                } else {
                    res.send('User does not exist!');
                }
            } else {
                console.log(err);
            }
        })

    } catch {
        res.status(500).send('Internal Server Error!');
    }
}

// Change user password
async function changePassword(req, res) {

    const params = req.body;
    const updatePasswordQuery = 'UPDATE fit_user SET password = ? WHERE user_name = ?';
    const userNameCheckQuery = 'SELECT * FROM fit_user WHERE user_name = ?';
    const hashedNewPassword = await bcrypt.hash(params.new_password, 5);
    let new_password = params.new_password;
    let confirm_password = params.confirm_password;

    try {
        mysqlConnection.query(userNameCheckQuery, params.user_name, async (err, result) => {
            if (!err) {
                let userArray = result;
                const isEmpty = Object.keys(userArray).length === 0;

                if (!isEmpty) {
                    let passwordMatch = await bcrypt.compare(params.password, result[0].password);
                    if (passwordMatch == true) {
                        console.log('user name, password combination is correct!');

                        if (new_password == confirm_password) {
                            mysqlConnection.query(updatePasswordQuery, [hashedNewPassword, params.user_name], (err, rows) => {
                                if (!err) {
                                    res.send("User Password updated sucessfully!");
                                } else {
                                    console.log(err);
                                }
                            })
                        } else {
                            res.status(400).send('New password should be equal to confirm password!');
                        }
                    } else {
                        res.status(400).send('Password Incorrect!');
                    }
                } else {
                    res.send('User does not exist!');
                }
            } else {
                console.log(err);
            }
        })

    } catch {
        res.status(500).send('Internal Server Error!');
    }
}

// forgot password
async function forgotPassword(req, res) {

    try {
        let params = req.body;
        let userArray;
        const getUserObjectQuery = 'SELECT * FROM fit_user WHERE user_name = ?';
        const updatePasswordQuery = 'UPDATE fit_user SET password = ? WHERE user_name = ?';

        mysqlConnection.query(getUserObjectQuery, params.user_name, async (err, results) => {
            if (!err) {
                userArray = results;
                const isEmpty = Object.keys(userArray).length === 0;

                if (!isEmpty) {

                    if (params.email == results[0].email) {

                        let generatedNumber = Math.floor((Math.random() * 999999) + 100000);
                        let generatedPassword = generatedNumber.toString();
                        const hashedPassword = await bcrypt.hash(generatedPassword, 5);

                        let Mailinfo = {
                            from: `"Revolake Team" <${process.env.MAIL}>`,
                            to: results[0].email,
                            subject: "Greetings From Team Revolake!",
                            html: `<b>Your new password for fitness app is - ${generatedPassword}. Make sure to change your password after login into your account.</b>`,
                        };
                        // await sendMail(Mailinfo);

                        mysqlConnection.query(updatePasswordQuery, [hashedPassword, params.user_name], (err, rows) => {
                            if (!err) {
                                res.send(`Your new password has been sent to your email (${generatedPassword})`);
                            } else {
                                console.log(err);
                            }
                        })

                    } else {
                        res.status(400).send('The email is incorrect!');
                    }
                } else {
                    res.status(400).send('Entered user name does not exist!');
                }
            } else {
                console.log(err);
            }
        })

    } catch {
        res.status(500).send('Internal Server Error!');
    }
}

function getAll(req, res) {
    commonService.getAll(req, res, dbTable);
}

function getById(req, res) {
    commonService.getById(req, res, dbTable);
}

function deleteById(req, res) {
    commonService.deleteById(req, res, dbTable);
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
    sendMail,
    createUser,
    loginUser,
    changePassword,
    forgotPassword,
    getAll,
    getById,
    deleteById,
    updateRecord
}