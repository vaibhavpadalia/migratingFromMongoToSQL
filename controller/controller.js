var mongoose = require('mongoose');
var User = mongoose.model('userData');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost', user: "root", password: ''
});

con.connect(err => {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Database connected');
    }
});

exports.createUser = (req, res) => {
    var user = new User({email: req.body.email, name: req.body.name, phone: req.body.phone, created_at: new Date(), updated_at: ""});
    user.save((error, response) => {
        if (error) {
            res.json({
                error: error
            });
        } else {
            res.json({
                success: true,
                body: response
            });
        }
    });
}

exports.findAll = (req, res) => {
    User.find({}, (error, response) => {
        if(error) {
            res.json({
                error: error
            });
        }
        else {
           
            res.json({
                body: response
            });
        }
    })
}

exports.createDb = (req, res) => {
    con.query("CREATE DATABASE IF NOT EXISTS mydb;", (err, result) => {
        if (err)
            throw err;
        console.log("Database created and connected");
    });
    con.query("USE mydb", (err,result) => {
        if(err)
            throw err;
        console.log('Inside new db');
    });
    con.query("CREATE TABLE IF NOT EXISTS portDB (id varchar(30) PRIMARY KEY)",
    function (err, result) {
        if (err)
            throw err;
        console.log("Table created");
    });
    var col = Object.keys(User.schema.obj);

    for (let i of col) {
        if (User.schema.paths[i].instance === 'String' || User.schema.paths[i].instance === 'Date' ||
        User.schema.paths[i].instance === 'ObjectID') {
            User.schema.paths[i].instance = 'Varchar(30)';
        }
        else if (User.schema.paths[i].instance === 'Number') {
            User.schema.paths[i].instance = 'int';
        }

        con.query('ALTER TABLE portDB ADD IF NOT EXISTS ' + i + ' ' + User.schema.paths[i].instance,
        function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
            console.log('New field '+ i + ' created');
            }
        });
    }
    res.json({success: 'Db created successfully'});
}


exports.insertData = (req, res) => {
    User.find({}, (error, response) => {
        if(error) {
            res.json(error);
        }
        else if(response.length === 0) {
            res.json({
                message: 'Null values received'
            });
        } 
        else {
            con.query("USE mydb", (err, result) => {
                if (err)
                    throw err;
                console.log('Inside new db');
            });
            var col = Object.keys(User.schema.obj);
            var str ='';
            for(let i of col ) {
                str = str + i + ',';
            }
            for(let k = 0; k < response.length; k++) {
                var str1 = '';
                for (let j of col) {
                    if (typeof response[k][j] === 'string' || typeof response[k][j] === 'object') 
                        str1 = str1 +  "'" + response[k][j] + "'" + ',';
                    else if (response[k][j] === undefined || response[k][j] === null)
                        str1 = str1 + 'NULL' + ',';
                    else 
                        str1 = str1 + response[k][j] + ',';
                }
                con.query("INSERT IGNORE INTO portDB ("+ str +"id)VALUES("+ str1 +"'" + response[k]._id + "')",
                    (err, result) => {
                        if (err)
                            throw err;
                        console.log('Insertion number ' + k + ' successful');
                    })
            }
        }
        res.json({
            success: true
        });
    })
}
