const request = require('supertest');
const {
    assert
} = require('chai');

const server = require('../server')

let agent;
before(done => {
    // 'app' is express instance return by server init
    server((app) => {
        agent = request.agent(app);
        done();
    });
});

describe('App starts and agent can load index.', () => {
    it('Retrieve CMS index,', (done) => {
        agent.get('/')
            .expect('Content-Type', /html/)
            .expect(200, done());
    });
});