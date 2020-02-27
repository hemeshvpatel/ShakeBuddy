const express = require("express");
const bodyparser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyparser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            ingredients: [String!]!
        }

        type RootMutation{
            createIngredient(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      ingredients: () => {
        return ["Blueberry", "Strawberry", "Peanut Butter"];
      },
      createIngredient: args => {
        const ingredientName = args.name;
        return ingredientName;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
