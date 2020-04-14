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

describe('Get all route content.', () => {
    it('Retrieve about content and ensure JSON response with required keys.', done => {
        request
            .get('/get/about')
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});