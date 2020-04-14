const request = require('supertest')('http://localhost:3000');
const {
    expect
} = require('chai');

describe('App starts and agent can load index.', function () {
    it('CMS index is valid html, status 200,', function (done) {
        request.get('/')
            .end(function (err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body.thing).be.
                done()
            });
    });
});