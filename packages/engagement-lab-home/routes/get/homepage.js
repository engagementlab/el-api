/**
 * @fileoverview Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve home data
 *
 * ==========
 */
const BuildData = async (req, res) => {
    const {
        db,
    } = res.locals;

    const initiative = db.collection('initiatives');
    // const project = db.collection('Project');
    const event = db.collection('Event');
    const about = db.collection('About');

    // const projectFields = 'name image.public_id key projectType byline -_id';
    const eventFields = 'name date key -_id';
    const initiativeFields = 'name description image.public_id key projects -_id';

    try {
        // Get initiatives
        const initiatives = await initiative.findOne({}, initiativeFields);
        // .sort({
        //         sortOrder: 'ascending',
        // });
        // .populate({
        //         path: 'projects',
        //         select: 'name key -_id',
        //         options: {
        //                 limit: 3,
        //                 sort: 'name',
        //         },
        // });
        console.log(initiatives);
        // Get a couple featured projects
        // const projects = await project.find({
        //         featured: true,
        // }, projectFields).limit(2);
        // Get 3 events most recent by date
        const events = await event.find({
            enabled: true,
        }, eventFields).sort({
            date: 'descending',
        }).limit(3);
        // Get tagline
        const tagline = await about.findOne({}, 'tagline -_id');
        const data = {
            initiatives,
            events,
            tagline,
        };

        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

module.exports = (req, res) => BuildData(req, res);