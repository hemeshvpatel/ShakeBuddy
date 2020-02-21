const express = require(`express`); // import express
const bodyParser = require(`body-parser`); // import body-parser
const graphqlHttp = require("express-graphql"); // import graphql to use as middleware
const { buildSchema } = require("graphql"); // import the function to build our schema

const app = express(); // create express server

const shakes = []; // create an array of Shakes to store, temp until MongoDB

app.use(bodyParser.json()); // use body-parser middleware to parse incoming json

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Shake {
            _id: ID!
            name: String!
            description: String!
            creator: String!
        }

        input ShakeInput {
            name: String!
            description: String!
            creator: String!
        }

        type shakeQuery {
            shakes: [Shake!]!
        }
        
        type shakeMutation {
            createShake(shakeInput: ShakeInput): Shake
        }

        schema {
            query: shakeQuery
            mutation: shakeMutation
        }
    `),
    rootValue: {
      shakes: () => {
        return shakes;
      },
      createShake: args => {
        const shake = {
          _id: "1234",
          name: args.name,
          description: args.description,
          creator: args.creator
        };

        shakes.push(shake);
        return shakes;
      }
    },
    graphiql: true
  })
);

app.get(`/`, (request, response, next) => {
  response.send("Our app is alive!");
});

app.listen(5000, () => {
  console.log("Now listening on port 5000");
}); // setup server to run on port 5000
