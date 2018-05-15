const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://localhost:27017', (err, database) => {
    if (err) return console.log(err)
    db = database.db('test')
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
    
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.post('/quotes', (req, res) => {
    if(db!==null){
        db.collection('user').save(req.body, (err, result) =>{
            if(err) return console.log(err)
            console.log('save database')
            res.redirect('/')
        })
    }
})
app.get('/', (req, res) =>{
    db.collection('user').find().toArray((err, result) =>{
        if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
    })
})

