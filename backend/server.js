require("dotenv").config();

const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const rowdy = require("rowdy-logger");
const routesReport = rowdy.begin(app);

const morgan = require("morgan");
app.use(morgan("tiny"));

app.use(express.json());
app.use(require("cors")());

const models = require("./models");

const createUser = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await models.user.create({
      email: req.body.email,
      password: hashedPassword,
    });

    const encryptedId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // res.json({message: 'ok', user})
    res.json({ message: "ok", userId: encryptedId });
  } catch (error) {
    res.status(400);
    res.json({ error: "email already taken" });
  }
};

app.post("/users", createUser);

const login = async (req, res) => {
  try {
    const user = await models.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user.password === req.body.password) {
      //    res.json({message: 'login successful', user: user})
      const encryptedId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ message: "login successful", user: encryptedId });
    } else {
      res.status(401);
      res.json({ error: "login failed" });
    }
  } catch (error) {
    res.status(400);
    res.json({ error: "login failed" });
  }
};
app.post("/users/login", login);

const userProfile = async (req, res) => {
  // console.log(req.headers);
  try {
    //get the value out of headers instead of <body>
    //becuase thats where the frontend included it
    //now that we enncryted the id before sending it to the client, we  need to decrypt it when they send it back
    const user = await models.user.findOne({
      where: {
        // id: req.headers.authorization,
        id: decryptedId.userId,
      },
    });
    if (user === null) {
      res.status(404).json({ error: "user not found" });
    } else {
      res.json({ message: "user success", user });
    }
    //res.json ({message: 'user looked up successfully', user})
  } catch (error) {
    res.status(404).json({ error: "user not found" });
  }
};
app.get("/users/profile", userProfile);
const PORT = process.env.port || 3008;
app.listen(PORT, () => {
  routesReport.print();
});
