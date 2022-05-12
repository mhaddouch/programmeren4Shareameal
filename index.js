const http = require("http");
// const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
let database = [];
let id = 0;
app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});




server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
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
