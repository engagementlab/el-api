/**
 * Engagement Lab Homepage API
 * Developed by Engagement Lab, 2020
 *
 * @author Johnny Richardson
 * Content API routing
 * ==========
 */

const express = require('express');

const Routes = (importer, db) => {
    const router = express.Router();
    const productionMode = process.argv.slice(2)[0] && process.argv.slice(2)[0] === 'prod';

    // Import Route Controllers
    const importRoutes = importer(__dirname);
    const routes = importRoutes('get');

    // Setup Route Bindings
    // CORS
    const corsPort = productionMode ? 1864 : 4200;

    router.all('/*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', `http://localhost:${corsPort}`);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method'
        );

        res.locals.db = db;

        if (req.method === 'OPTIONS') res.send(200);
        else next();
    });

    router.get('/get/about', routes.about);
    // router.get('/get/events/:key?', routes.event.data);
    // router.get('/get/homepage', routes.homepage);
    // router.get('/get/initiative/:key', routes.initiative.data);
    // router.get('/get/contact', routes.contact);
    // router.get('/get/jobs', routes.jobs);
    // router.get('/get/masters/:key?', routes.masters);
    // router.get('/get/privacy', routes.privacy);
    // router.get('/get/projects/:key?', routes.project.data);
    // router.get('/get/publications/:key?', routes.publication.data);

    // router.get('/get/search/:string', routes.search);
    // router.get('/get/team/:key?', routes.team.data);

    // router.get('/keys/events', routes.event.keys);
    // router.get('/keys/initiatives', routes.initiative.keys);
    // router.get('/keys/projects', routes.project.keys);
    // router.get('/keys/publications', routes.publication.keys);
    // router.get('/keys/team', routes.team.keys);

    // Error
    router.get('*', (req, res) => {
        res.status(500).send(`No route found for path ${req.url}.`);
    });

    return router;
};

module.exports = Routes;
