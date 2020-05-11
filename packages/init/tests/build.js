/**
 * Engagement Lab Content and Data API
 * Developed by Engagement Lab, 2020
 * ==============
 * Tests for build process
 *
 * @author Johnny Richardson
 *
 * ==========
 */

const request = require('supertest')('http://localhost:3000');
const {
    expect,
} = require('chai');

// describe('Start build process.', () => {

//     const {
//         spawn,
//     } = require('child_process');
//     it('test', function () {
//         const child = spawn('node', ['../build']);
//         child.stdout.on('data', chunk => {
//             console.log(chunk);
//         });

//         child.on('error', chunk => {
//             console.log(chunk);
//         });
//         child.on('exit', (err, info) => {
//             console.log('chunk');
//         });
//     }());

// });

describe('CSS files exist for CMS content and are valid.', () => {
    it('Global CSS,', done => {
        request.get('/cms/style/admin').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.type).to.be.a('string', '/text/css');
            done(err);
        });
    });
    it('Admin page CSS,', done => {
        request.get('/cms/style/admin').end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.type).to.be.a('string', '/text/css');
            done(err);
        });
    });
});