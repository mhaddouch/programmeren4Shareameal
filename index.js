const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let id = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Share a meal application",
  });
});


app.post("/api/user", (req, res, next) => {
  let user = req.body;
  console.log(user);
  let email = user.emailAdress;
  if (email == undefined) {
    res.status(400).json({
      status: 400,
      result: "Please enter a value for 'emailAdress'.",
    });
  } else {
    let userArray = userDatabase.filter((item) => item.emailAdress == email);
    if (userArray.length > 0) {
      res.status(401).json({
        status: 401,
        result: `The email address ${email} is already in use, please use a different emailaddress or log in.`,
      });
    } else {
      id++;
      user = {
        id,
        ...user,
      };
      userDatabase.push(user);
      console.log(userDatabase);
      res.status(201).json({
        status: 201,
        result: `User with email address ${email} was added.`,
      });
    }
  }
});

app.get("/api/movie/:movieId", (req, res, next) => {
  const movieId = req.params.movieId;
  console.log(`Movie met ID ${movieId} gezocht`);
  let movie = database.filter((item) => item.id == movieId);
  if (movie.length > 0) {
    console.log(movie);
    res.status(200).json({
      status: 200,
      result: movie,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `Movie with ID ${movieId} not found`,
    });
  }
});

app.get("/api/movie", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
