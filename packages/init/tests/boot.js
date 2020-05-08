/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 * ==============
 * Init package tests
 *
 * @author Johnny Richardson
 *
 * ==========
 */

const request = require('supertest')('http://localhost:3000');
const {
    expect,
} = require('chai');

describe('App starts and agent can load index.', () => {
    it('CMS index is valid html, status 200,', done => {
        request.get('/').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.type).to.be.a('string', 'text/html');
            done(err);
        });
    });
});
