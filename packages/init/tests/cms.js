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

describe('Mock user is logged in.', () => {
    it('CMS login route redirects to callback,', done => {
        request.get('/cms/login').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.contain.a('string', '/callback?__mock_strategy_callback=true');
            done(err);
        });
    });
    it('CMS index redirects user to login route,', done => {
        request.get('/cms').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.be.a('string', '/cms/login');
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
    it('User tries to load \"engagement-lab-home\" CMS non-React router and is redirected,', done => {
        request.get('/cms/home').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.be.a('string', '/cms/@/home');
            done(err);
        });
    });
    it('User can load \"engagement-lab-home\" CMS,', done => {
        request.get('/cms/@/home/').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            // expect(res.type).to.be.a('string', 'text/html');
            done(err);
        });
    });
    it('CMS logout route redirects server root,', done => {
        request.get('/cms/logout').end((err, res) => {
            expect(res.statusCode).to.equal(302);

            expect(res.header.location).to.be.a('string', '/');
            done(err);
        });
    });
});