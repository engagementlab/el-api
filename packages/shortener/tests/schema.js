/**
 * Engagement Lab URL Shortener
 * Developed by Engagement Lab, 2020
 * ==============
 * Schema tests
 *
 * @author Johnny Richardson
 *
 * ==========
 */
const request = require('supertest')('http://localhost:3002');
const chai = require('chai');

const { assert } = chai;
chai.use(require('chai-graphql'));

let env; 

before(done => {

  env = process.env;
  process.env.PORT = 3002;
  require('../index');
  // setTimeout(() => done(), 1500);
  done()
});

describe('URL shortener GraphQL', () => {
  it('Try to get links.', done => {
    request
      .post('/graphql')
      .send({
        query: `{getLinks{
                    id
                    shortUrl
                    originalUrl
                    label
                }}`,
      })
      .expect(200)
      .end((err, res) => {
        console.log(res.data)
        // res will be valid graphql response
        if (err) return done(err);
        assert.graphQL(res);
        done();
      });
  });
});
