/**
 * Engagement Lab Content and Data API
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
    expect
} = require('chai');

describe('Get all route content and ensure JSON response with required keys.', () => {
    it('About content', done => {
        request
            .get('/get/about').end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.contain.keys(
                    'missionStatement',
                    'summary1',
                    'summary2',
                    'research',
                    'workshops',
                    'tools',
                    'teaching',
                    'design');
                done(err);
            });
    });
});