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

describe('App starts and agent can load root.', () => {
    it('Server booted, status 200,', done => {
        request.get('/').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.type).to.be.a('string', 'text/html');
            done(err);
        });
    });
});

describe('Mock user is logged in.', () => {
    it('CMS index redirects user to login route,', done => {
        request.get('/cms').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.be.a('string', '/cms/login');
            done(err);
        });
    });
    it('CMS login route redirects to callback,', done => {
        request.get('/cms/login').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.contain.a('string', '/callback?__mock_strategy_callback=true');
            done(err);
        });
    });
    it('CMS mock user is logged in, admin page is valid HTML,', done => {
        request.get('/cms/admin').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.type).to.be.a('string', 'text/html');
            done(err);
        });
    });
});