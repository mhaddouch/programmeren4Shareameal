const assert = require('assert');
let database = [];
let id =0;


let controller = {
    validateUser:(req,res,next)=>{
        let user = req.body;
        let {firstName,lastName,emailAddress,password} = user;

        try {
            assert(typeof firstName === 'string','firstName must be a string.');
            assert(typeof lastName === 'string','lastName must be a string.');
            assert(typeof emailAddress === 'string','emailAdress must be a string.');
            assert(typeof password === 'string','password must be a string.');
            next();
        } catch (err) {
          const error={
            status: 400,
            result:err.message,
          }
            next(error);
        }
    },

    addUser:(req,res)=>{
        let user = req.body;
    console.log(user);
    let email = user.emailAddress;
    if (email == undefined) {
      res.status(400).json({
        status: 400,
        result: "Please enter a value for 'emailAddress'.",
      });
    } else {
      let userArray = database.filter((item) => item.emailAddress == email);
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
        database.push(user);
        console.log(database);
        res.status(201).json({
          status: 201,
          result: `User with email address ${email} was added.`,
        });
      }
    }
    },

    getAllUsers:(req,res)=>{
        res.status(201).json({
            status: 201,
            result: database,
        });
    },
    getUserId:(req,res,next)=>{
        const userId = req.params.userId;
        let userArray = database.filter((item) => item.id == userId);
        if (userArray.length > 0) {
          console.log(userArray);
          res.status(201).json({
            status: 201,
            result: userArray,
          });
        } else {
          const error = {
            status: 404,
            result: `User with id ${userId} not found`,
          };
          next(error);
        }
    }
}

module.exports = controller;