const mysql = require('mysql')
const { encrypt, decrypt } = require('../utils/crypt')

// Connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

//view users
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as ID ' + connection.threadId)

        const query = `
            SELECT
                *,
                ${decrypt('first_name')},
                ${decrypt('last_name')},
                ${decrypt('email')},
                ${decrypt('phone')}
            FROM user ORDER BY id DESC
        `

        //user the connection
        connection.query(query, (err, rows) => {
            // when done with the connection, release it
            connection.release()

            if (!err) {
                let removeUser = req.query.removed
                res.render('home', { rows, removeUser })
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}

// find user by search
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err //not connected!!
        console.log('connected as ID ' + connection.threadId)
        let searchTerm = req.body.search

        var query = `
            SELECT
                *,
                ${decrypt('first_name')},
                ${decrypt('last_name')},
                ${decrypt('email')},
                ${decrypt('phone')}
            FROM user
            WHERE first_name LIKE ? OR last_name LIKE ?
        `

        //user the connection
        connection.query(query, ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                res.render('home', { rows })
            } else {
                console.log(err)
            }
            console.log('the data from user tables: \n', rows)
        })
    })
}

exports.form = (req, res) => {
    res.render('add-user')
}

// add new user 
exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body
    pool.getConnection((err, connection) => {
        if (err) throw err //not connected!!
        console.log('connected as ID ' + connection.threadId)
        let searchTerm = req.body.search

        const query = `
            INSERT INTO user
            SET first_name = ${encrypt(first_name)}, last_name = ${encrypt(last_name)}, email = ${encrypt(email)}, phone = ${encrypt(phone)}, comments = ?
        `
        //user the connection
        connection.query(query, [comments], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                res.render('add-user', { alert: 'User added Successfully.' })
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}

// edit user 
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err //not connected!!
        console.log('connected as ID ' + connection.threadId)

        const query = `
            SELECT
                *,
                ${decrypt('first_name')},
                ${decrypt('last_name')},
                ${decrypt('email')},
                ${decrypt('phone')}
            FROM user
            WHERE id = ?
        `
        //user the connection
        connection.query(query, [req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                res.render('edit-user', { rows })
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}

// Update user 
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body
    pool.getConnection((err, connection) => {
        if (err) throw err //not connected!!
        console.log('connected as ID ' + connection.threadId)
        //user the connection

        var query = `
            UPDATE user
            SET first_name = ${encrypt(first_name)}, last_name = ${encrypt(last_name)}, email = ${encrypt(email)}, phone = ${encrypt(phone)}, comments = ?
            WHERE id = ?
        `
        connection.query(query, [comments, req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                pool.getConnection((err, connection) => {
                    if (err) throw err //not connected!!
                    console.log('connected as ID ' + connection.threadId)

                    var query = `
                        SELECT
                            *,
                            ${decrypt('first_name')},
                            ${decrypt('last_name')},
                            ${decrypt('email')}
                        FROM user
                        WHERE id = ?`
                    //user the connection
                    connection.query(query, [req.params.id], (err, rows) => {
                        // when done with the connection, release it
                        connection.release()
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated` })
                        } else {
                            console.log(err)
                        }
                        console.log('the data from user table: \n', rows)
                    })
                })
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}

//delete
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as ID ' + connection.threadId)
        //user the connection
        connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                let removeUser = encodeURIComponent('Record succesfully removed')
                res.redirect('/?removed' + removeUser)
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}

//view
exports.viewall = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as ID ' + connection.threadId)
        //user the connection

        const query = `
            SELECT
                *,
                ${decrypt('first_name')},
                ${decrypt('last_name')},
                ${decrypt('email')},
                ${decrypt('phone')}
            FROM user
            WHERE id =?
        `
        connection.query(query, [req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release()
            if (!err) {
                res.render('view-user', { rows })
            } else {
                console.log(err)
            }
            console.log('the data from user table: \n', rows)
        })
    })
}