const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
let database = [];
chai.should();
chai.use(chaiHttp);

// dit is zoals hoofdstukken van boeken
describe('Manage users',()=>{
    describe('use case 201 add users  /api/user',()=>{
        beforeEach((done)=>{
            database = [];
            done();
        });
    });

    it.skip(' Test case 201 bv When a required input is missing, a valide error should be returned',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
            //title ontbreekt
            "lastName":"dfdfrfrf",
            "emailAddress":"453453",
            "password":44543
        })
        .end((err,res)=>{
            res.should.be.an('object')
            let{status,result} =  res.body;
            status.should.be.equals(400)
            result.should.be.an('string').that.equals('firstName must be a string');
        });
        done();
    });
    it('Testcase 202 other test exameples',()=>{

    })

});