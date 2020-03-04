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

const ingredients = ingredientIds => {
  return Ingredient.find({_id: {$in: ingredientIds}})
  .then(ingredients => {
    return ingredients.map(ingredient => {
      return { ...ingredient._doc, _id: ingredient.id, creator: user.bind(this, ingredient.creator)}
    })
  })
  .catch(err => {
    throw err;
  });
}

const user = userId => {
  return User.findById(userId)
  .then(user => {
    return {...user._doc, _id: user.id, createdIngredients: ingredients.bind(this, user._doc.createdIngredients)}
  })
  .catch(err => {
    throw err
  })
}

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
          creator: User!
        }

        type User {
          _id: ID!
          username: String!
          password: String
          createdIngredients: [Ingredient!]
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
          // .populate('creator')
          .then(ingredients => {
            return ingredients.map(ingredient => {
              return {
                ...ingredient._doc,
                _id: ingredient.id,
                creator: user.bind(this, ingredient._doc.creator)
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
          imageUrl: args.ingredientInput.imageUrl,
          creator: "5e600bbf3a4da0468fab3787"
        });
        //ingredients.push(ingredient);
        let createdIngredient;
        return ingredient
          .save()
          .then(result => {
            createdIngredient = { ...result._doc };
            return User.findById("5e600bbf3a4da0468fab3787");
          })
          .then(user => {
            if (!user) {
              throw new Error("Username already exists.");
            }
            user.createdIngredients.push(ingredient);
            return user.save();
          })
          .then(result => {
            return createdIngredient;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
      createUser: args => {
        return User.findOne({ username: args.userInput.username })
          .then(user => {
            if (user) {
              throw new Error("Username already exists.");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then(hashedPassword => {
            const user = new User({
              username: args.userInput.username,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, password: null, _id: result.id };
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
