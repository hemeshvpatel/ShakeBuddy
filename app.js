const express = require("express");
const bodyparser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const app = express();

// Temporary data
const ingredients = [];

app.use(bodyparser.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Ingredient {
          _id: ID!
          name: String!
          servingSizeAmount: Int!
          servingSizeUnit: String!
          carb: Int!
          protein: Int!
          fat: Int!
          imageUrl: String!
        }

        input IngredientInput {
          name: String!
          servingSizeAmount: Int!
          servingSizeUnit: String!
          carb: Int!
          protein: Int!
          fat: Int!
          imageUrl: String!
        }

        type RootQuery {
            ingredients: [Ingredient!]!
        }

        type RootMutation{
            createIngredient(ingredientInput: IngredientInput): Ingredient
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      ingredients: () => {
        return ingredients;
      },
      createIngredient: args => {
        const ingredient = {
          _id: Math.random().toString(),
          name: args.ingredientInput.name,
          servingSizeAmount: args.ingredientInput.servingSizeAmount,
          servingSizeUnit: args.ingredientInput.servingSizeUnit,
          carb: args.ingredientInput.carb,
          protein: args.ingredientInput.protein,
          fat: args.ingredientInput.fat,
          imageUrl: args.ingredientInput.imageUrl
        };
        console.log(args);
        ingredients.push(ingredient);
        return ingredient;
      }
    },
    graphiql: true
  })
);

//mongoose connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-2edcx.mongodb.net/test?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
