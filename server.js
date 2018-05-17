const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
// write file log 
const fs = require('fs');

//database init default null 
var db
// mongodb get connect with loocalhost
MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err){
        //write file
        var date = new Date();
        var path = 'log/error.log';
        errorMessage = date + ' '+ err
        fs.appendFile(path, errorMessage, function (error) {
            if (error) throw error;
            console.log('Saved error connect database!');
        });
        return console.log(err)
    } 
    db = database.db('test')
    app.listen(3001, () => {
        console.log('listening on 3001')
    })

})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Add headers, to Same-Origin Policy (SOP)
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.urlencoded({ extended: true }))
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })
// Post insert, user push post of info, that info will insert database
app.post('/', (req, res) => {
    console.log('save database')
    console.log(req.body)
    if (db !== null) {
        db.collection('user').save(req.body, (err, result) => {
            //write file
            var date = new Date();
            var browser = req.headers['user-agent']
            var errorLogFile = 'log/error.log';
            if (err) {
                errorLogMessage =  req.ip + date + 'POST http://localhost:3002/ ' + res.statusCode + ' ' + browser + err;
                fs.appendFile(errorLogFile, errorLogMessage, function (err) {
                    if (err) throw err;
                    console.log('Saved error!');
                });
                return console.log(err)
            }
            // console.log('save database')
            // res.redirect('/')
            var pathToAccessLog = 'log/accsess.log';
            accessLogMessage = req.ip + date + 'POST http://localhost:3002/ ' + res.statusCode + ' ' + browser + '\n'
            fs.appendFile(pathToAccessLog, accessLogMessage, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        })
    }
})
//User send request post info, and server respon post of info
app.get('/', (req, res) => {
    db.collection('user').find({}).toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        // res.render('index.ejs', {quotes: result})
        res.json(result)
        //console.log(req.ip + date + 'GET http://localhost:3002/ ' + res.statusCode + ' ' + browser);

        //write file
        var date = new Date();
        var browser = req.headers['user-agent'];
        var pathToAccessLog = 'log/accsess.log';
        accessLog = req.ip + date + 'GET http://localhost:3002/ ' + res.statusCode + ' ' + browser + '\n'

        fs.appendFile(pathToAccessLog, accessLog, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    })
})

