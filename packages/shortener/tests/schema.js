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
const request = require('supertest')('http://localhost:3000');
const chai = require('chai');

const { assert } = chai;
chai.use(require('chai-graphql'));

describe('URL shortener GraphQL', () => {
  it('Try to get link.', done => {
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
        // res will be valid graphql response
        if (err) return done(err);
        assert.graphQL(res);
        done();
      });
  });
});
