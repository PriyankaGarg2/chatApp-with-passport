var supertest=require('supertest');
var should=require('should'),
routes = require("../routes");
var expect=require('chai').expect;
var api = supertest('http://localhost:3000');
//port where server is running
//var server=supertest.agent('http://localhost:3000');

//unit test begin
describe("unit tests",function(){
  it("should return login page",function(done){
    api.get('/login')
    .end(function(err,res){
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
  it('should register a user with it',function(done){
    api.post('/register')
    .send({
      name:'User1',
      email:'a@gmail.com',
      phone:'7838218481',
      password:'user1'
    })
    .end(function(err,res){
      expect(res.statusCode).to.equal(302);
      done();
    });
  });
});
