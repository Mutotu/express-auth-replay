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
  // console.log(req.body);
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    // console.log(hashedPassword);

    const user = await models.user.create({
      email: req.body.email,
      password: hashedPassword,
    });

    ////////newly added
    // const { dataValues, ...notNeeded } = user;
    console.log(process.env.JWT_SECRET);
    const encryptedId = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    res.status(201).json({
      userId: user.id,
      token: encryptedId,
    });
    // res.json({ message: "ok", userId: encryptedId });
  } catch (error) {
    res.status(400).json(error);
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

    /////////////////////its not loging beucase when password is compare it is numbers againit encripted ones
    let passwordMatch = false;
    if (user) {
      passwordMatch = await bcrypt.compare(req.body.password, user.password);

      if (passwordMatch) {
        // const { dataValues, ...notNeeded } = user;
        // Create a jwt authorization token to return for the found user.

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        console.log(token);
        // Separate the user's data values into only the parts we will return.
        // const { password, createdAt, updatedAt, id, ...userReturn } =
        //   dataValues;

        // userReturn.authorization = authorization;
        res.status(200).json({ user: user, token: token });
      }
    }
    // if (user.password === req.body.password) {
    //   console.log("inside olog");
    //   //    res.json({message: 'login successful', user: user})
    //   const encryptedId = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    //   res.json({ message: "login successful", user: encryptedId });
    // } else {
    //   res.status(401);
    //   res.json({ error: "login failed on else statement" });
    // }
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
