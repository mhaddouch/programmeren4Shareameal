process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb'
process.env.LOGLEVEL = 'warn'


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');





const assert = require('assert')
require('dotenv').config()
const dbconnection = require('../../database/dbconnection')





let database = [];
chai.should();
chai.use(chaiHttp);


/**
 * Db queries to clear and fill the test database before each test.
 */
 const CLEAR_MEAL_TABLE = 'DELETE IGNORE FROM `meal`;'
 const CLEAR_PARTICIPANTS_TABLE = 'DELETE IGNORE FROM `meal_participants_user`;'
 const CLEAR_USERS_TABLE = 'DELETE IGNORE FROM `user`;'
 const CLEAR_DB = CLEAR_MEAL_TABLE + CLEAR_PARTICIPANTS_TABLE + CLEAR_USERS_TABLEs



// dit is zoals hoofdstukken van boeken
describe('Manage users',()=>{
    describe('use case 201 add users  /api/user',()=>{
        beforeEach((done)=>{
            database = [];
            done();
        });
    });

    it(' Test case 201-1 When a required input is missing, a valide error should be returned',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
           // "firstName":"fefefefe",
            "lastName":"dfdfrfrf",
            "emailAddress":"453453",
            "password": "frfrfr"
            
        })
        .end((err,res)=>{
            res.should.be.an('object')
            let{status,result} =  res.body;
            status.should.be.equals(400);
            result.should.be.an('string').that.equals('firstName must be a string.');
        });
        done();
    });
    it('Testcase 201-2 When emailaddress is invalid, a valide error should be returned ',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
            
            "firstName":"fefefefe",
            "lastName":"dfdfrfrf",
           "emailAddress":453453,
            "password":"44543"
        })
        .end((err,res)=>{
            res.should.be.an('object')
            let{status,result} =  res.body;
            status.should.be.equals(400);
            result.should.be.an('string').that.equals('emailAdress must be a string.');
        });
       done();
    });
    it('Testcase 201-3 When password is invalid, a valide error should be returned ',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
            
            "firstName":"fefefefe",
            "lastName":"dfdfrfrf",
           "emailAddress":"453453",
            "password":44543
        })
        .end((err,res)=>{
            res.should.be.an('object')
            let{status,result} =  res.body;
            status.should.be.equals(400);
            result.should.be.an('string').that.equals('password must be a string.');
        });
       done();
    });

});