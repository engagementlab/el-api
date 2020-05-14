/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 * ==============
 * Homepage v2.x route tests
 *
 * @author Johnny Richardson
 *
 * ==========
 */
const request = require('supertest')('http://localhost:3000');
const {
    expect,
} = require('chai');

describe('Engagement Lab Homepage API', () => {
    it('Try to get non-existent route.', done => {
        const route = Math.ceil(Math.random() * 10);
        request.get(`/get/${route}`).end((err, res) => {
            expect(res.statusCode).to.equal(500);
            expect(res.text).contains.a('string', `No route found for path /get/${route}.`);

            done(err);
        });
    });
    describe('Get all route content and ensure JSON response with required keys.', () => {
        const routes = {
            'about': [
                'missionStatement',
                'summary1',
                'summary2',
                'research',
                'workshops',
                'tools',
                'teaching',
                'design'
            ],
            'homepage': ['initiatives', 'projects', 'events', 'tagline'],
            'contact': ['community', 'students', 'blurb', 'name'],
            // 'jobs': [],
            // 'masters': [],
        };

        Object.keys(routes).forEach(name => {
            it(`${name} content`, done => {
                request
                    .get(`/get/${name}`).end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        if (routes[name].length > 0)
                            expect(res.body).to.contain.keys(routes[name]);

                        done(err);
                    });
            });
        });
    });
});