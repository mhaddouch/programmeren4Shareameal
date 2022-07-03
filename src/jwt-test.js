var jwt = require('jsonwebtoken');

const privateKey = 'secret';

jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' }, function(err, token) {
    console.log(token);
  });