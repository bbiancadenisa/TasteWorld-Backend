const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session")
const Recipe = require("./schemas/recipe");
const User = require("./schemas/user");
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 3600000
  }
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.post("/add-recipe", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const result = await recipe.save();
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
})

app.get("/add-new-user", async (req, res) => {
  try {
    const user = new User({
      username: "test",
      password: "test"
    });
    const result = await user.save();
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
})

app.post("/login", async (req, res) => {
  try {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    const result = await User.findOne({ username: username });
    if(result){
      req.session.loggedin = true; //req.session param set
			req.session.username = username;
    }
    if (!result) {
      return res.status(400).json({ error: "Username not found" });
    }
    if(result.password == password){
      return res.send(req.session);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
})

app.get("/verifyUser",(req,res,next) => {
  console.log(req.session); //the req.session from login does not persist
  if(req.session.loggedin === true){
    next();
  }else{
    // return res.status(403).json("Not authenticated");
    return res.status(200);
  }
})

app.get("/all-recipes", async (req, res) => {
  try {
    const result = await Recipe.find();
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
})

app.get("/single-recipe/:id", async (req, res) => {
  try {
    const result = await Recipe.findById(req.params.id);
    return res.status(200).json(result);

  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
})

app.use('*', (req, res) => res.status(404).json({ message: "Pagina nu a fost gasita" }));

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