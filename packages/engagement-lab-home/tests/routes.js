let request = require('supertest');
const {
    assert
} = require('chai');

request = request('http://localhost:3000');
describe('Get all route content.', () => {
    it('Retrieve about content,', done => {
        request
            .get('/get/about')
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});