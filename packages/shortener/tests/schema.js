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
const {
    expect,
} = require('chai');

describe('GraphQL', () => {
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
            // res will contain array with one user
            if (err) return done(err);
            res.body.user.should.have.property('id');
            res.body.user.should.have.property('name');
            res.body.user.should.have.property('username');
            res.body.user.should.have.property('email');
            done();
        });
});