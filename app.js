const express = require("express");
const bodyparser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Ingredient = require("./models/ingredients");
const User = require("./models/user");

const app = express();

// Temporary data
//const ingredients = [];

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

        type User {
          _id: ID!
          username: String!
          password: String
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

        input UserInput {
          username: String!
          password: String!
        }

        type RootQuery {
            ingredients: [Ingredient!]!
        }

        type RootMutation{
            createIngredient(ingredientInput: IngredientInput): Ingredient
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      ingredients: () => {
        return Ingredient.find()
          .then(ingredients => {
            return ingredients.map(ingredient => {
              return {
                ...ingredient._doc
              };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createIngredient: args => {
        //temporary object creation without MongoDB
        // const ingredient = {
        //   _id: Math.random().toString(),
        //   name: args.ingredientInput.name,
        //   servingSizeAmount: args.ingredientInput.servingSizeAmount,
        //   servingSizeUnit: args.ingredientInput.servingSizeUnit,
        //   carb: args.ingredientInput.carb,
        //   protein: args.ingredientInput.protein,
        //   fat: args.ingredientInput.fat,
        //   imageUrl: args.ingredientInput.imageUrl
        const ingredient = new Ingredient({
          name: args.ingredientInput.name,
          servingSizeAmount: args.ingredientInput.servingSizeAmount,
          servingSizeUnit: args.ingredientInput.servingSizeUnit,
          carb: args.ingredientInput.carb,
          protein: args.ingredientInput.protein,
          fat: args.ingredientInput.fat,
          imageUrl: args.ingredientInput.imageUrl
        });
        //ingredients.push(ingredient);
        return ingredient
          .save()
          .then(result => {
            console.log(result);
            return {
              ...result._doc
            };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
        return bcrypt
          .hash(args.userInput.password, 12)
          .then(hashedPassword => {
            const user = new User({
              username: args.userInput.username,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, _id: result.id };
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

//mongoose connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-2edcx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
