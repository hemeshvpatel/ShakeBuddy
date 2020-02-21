const express = require(`express`) // import express 
const bodyParser = require(`body-parser`) // import body-parser 
const graphqlHttp = require('express-graphql') // import graphql to use as middleware
const { buildSchema } = require('graphql') // import the function to build our schema
const mongoose = require('mongoose');

const app = express() // create express server

app.use(bodyParser.json()) // use body-parser middleware to parse incoming json

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type shakeQuery {
            shakes: [String!]!
        }
        
        type shakeMutation {
            createShake(text: String): String
        }

        schema {
            query: shakeQuery
            mutation: shakeMutation
        }
    `),
    rootValue: {
        shakes: () => {
            return ['Berry', 'Strawberry']
        },
        createShake: (args) => {
            const shakeText = args.text 
            return shakeText
        }
    },
    graphiql: true
}))

app.get(`/`, (request, response, next) => {
    response.send('Our app is alive!')
})

app.listen(5000, () => {
    console.log("Now listening on port 5000");
}) // setup server to run on port 5000