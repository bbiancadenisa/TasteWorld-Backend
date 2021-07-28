const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Recipe = require("./schemas/recipe");
const User = require("./schemas/user");
const app = express();
const port = 3001;


const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.get("/add-recipe", async (req, res) => {
  try {
    const recipe = new Recipe({
      title: "soup",
      ingredients: "flour, eggs, milk",
      prepTime: 30,
      prepInstructions: "heat the oven"
    });
    const result = await recipe.save();
    return res.status(200).json(result);
  }catch(err){
    console.log(err);
    return res.status(404).json(err);
  }
})

app.get("/all-recipes", async (req, res) => {
  try{
    const result = await Recipe.find();
    return res.status(200).json(result);
  }catch(err){
    console.log(err);
    return res.status(404).json(err);
  }
})

app.get("/single-recipe/:id", async (req, res) =>{
  try{
    const result = await Recipe.findById(req.params.id);
    return res.status(200).json(result);

  }catch(err){
    console.log(err);
    return res.status(404).json(err);
  }
})

app.use('*', (req, res) => res.status(404).json({message: "Pagina nu a fost gasita"}));

//connect to mongodb
const mongoURI = "mongodb+srv://denisa:tasteworld@cluster0.yhbxa.mongodb.net/taste-world?retryWrites=true&w=majority";

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Connected to database");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})