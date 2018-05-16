const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

//database init default null 
var db
// mongodb get connect with loocalhost
MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return console.log(err)
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
app.post('/', (req, res) => {
    console.log('save database')
    console.log(req.body)
    if (db !== null) {
        db.collection('user').save(req.body, (err, result) => {
            if (err) return console.log(err)
            // console.log('save database')
            // res.redirect('/')
        })
    }
})
app.get('/', (req, res) => {
    db.collection('user').find({}).toArray((err, result) => {
        if (err) return console.log(err)
        // renders index.ejs
        // res.render('index.ejs', {quotes: result})
        res.json(result)
        console.log('Van Toan check view page');
    })
})

