const express = require(`express`) // import express 
const bodyParser = require(`body-parser`) // import body-parser 
const app = express() // create express server

app.use(bodyParser.json()) // use body-parser middleware to parse incoming json

app.get(`/`, (request, response, next) => {
    response.send('Our app is alive!')
})

app.listen(5000) // setup server to run on port 5000