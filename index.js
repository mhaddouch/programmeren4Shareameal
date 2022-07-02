const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const userRouter = require('./src/routes/user.routes');
const logger = require("./src/config/config").logger

app.use(bodyParser.json());
let database = [];
let id = 0;
app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});
app.use(userRouter);



app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World",
  });
});
app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    result: "End-point not found",
  });
});

//error handler
// Hier moet je nog je Express errorhandler toevoegen.
app.use((err, req, res, next) => {
  logger.debug('Error handler called.')
  res.status(500).json({
      statusCode: 500,
      message: err.toString(),
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
