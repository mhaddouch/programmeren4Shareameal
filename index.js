
const express = require('express');
const res = require('express/lib/response');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let database = [];
let id =0;

app.all('*', (req, res, next) => {
  const method = req.method
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status:200,
    result:'hallo world'
  })
});

app.post('/api/movie',(req,res) =>{
  let movie = req.body;
  console.log(movie);
  id++;

  movie={
    id,
    ...movie,
  };

  database.push(movie);
  console.log(database);
  res.status(201).json({
    status:201,
    result: movie,
  });
});

app.all('*',(req,res)=>{
  res.status(404).json({
    status:404,
    result:'End-point not found',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

