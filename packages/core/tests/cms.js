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

    it('CMS mock user creates a new user via admin tool,', done => {
        const body = {
            name: 'Admin User',
            email: 'email@place.org',
            isAdmin: true,
            permissions: ['test'],
        };

        request.post('/cms/admin/edit')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body)).end((err, res) => {
                expect(res).to.not.be.undefined;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('msg', 'created');

                done();
            });
    });

    it('CMS mock user edits same user via admin tool,', done => {
        const body = {
            email: 'email@place.org',
            isAdmin: false,
            permissions: ['test', 'test-2'],
        };

        request.post('/cms/admin/edit')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body)).end((err, res) => {
                expect(res).to.not.be.undefined;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('msg', 'saved');
                done();
            });
    });

    it('CMS mock user deletes same user via admin tool,', done => {
        const body = {
            email: 'email@place.org',
            delete: true,
        };

        request.post('/cms/admin/edit')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body)).end((err, res) => {
                expect(res).to.not.be.undefined;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property('msg', 'deleted');
                done();
            });
    });

    it('User tries to load \"engagement-lab-home\" CMS non-React router and is redirected,', done => {
        request.get('/cms/engagement-lab-home').end((err, res) => {
            expect(res.statusCode).to.equal(302);
            expect(res.header.location).to.be.a('string', '/cms/@/home');
            done(err);
        });
    });

    it('User can load \"engagement-lab-home\" CMS,', done => {
        request.get('/cms/@/engagement-lab-home/').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done(err);
        });
    });

    it('CMS logout route redirects "bye" page,', done => {
        request.get('/cms/logout').end((err, res) => {
            expect(res.statusCode).to.equal(302);

            expect(res.header.location).to.be.a('string', '/cms/bye');
            done(err);
        });
    });
});