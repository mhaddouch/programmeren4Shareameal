const text = require('body-parser/lib/types/text');
const { contentType } = require('express/lib/response');
const res = require('express/lib/response');
const http = require('http');

const port = process.env.PORT || 3000;
const result = {
code : 200,
message :'Hello world',
};

const server = http.createServer((req,res)=>{
  res.statusCode = 200;
  res.setHeader('Content-Type','text/plain');
  res.end(JSON.stringify(result));

});

server.listen(port, () => {
  console.log(`Serving running at http://${port}/`);
});