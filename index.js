
const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const userRouter = require('./src/routes/user.routes');
app.use(bodyParser.json());
let database = [];
let id = 0;
app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});
app.use(userRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    result: "End-point not found",
  });
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err);

});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
