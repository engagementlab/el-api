/**
 * Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve about page data
 *
 * ==========
 */
const BuildData = async (req, res) => {
    const {
        db,
    } = res.locals;

    // const person = db.model('Person');
    // const partner = db.model('Partner');
    const about = db.model('About');

    const aboutFields =
        'missionStatement summary1 summary2 images.public_id research workshops tools teaching design -_id';
    const partnerFields = 'name image.public_id url -_id';
    const personFields = 'name title key image.public_id url -_id';

    try {
        // Get about
        const aboutData = await about.findOne({}, aboutFields);
        // Get a couple featured projects
        // const partnersData = await partner.find({}, partnerFields);
        // Get faculty and staff
        // const peopleData = await person
        //     .find({
        //             category: {
        //                 $in: ['faculty leadership', 'staff'],
        //             },
        //         },
        //         personFields
        //     )
        //     .sort({
        //         sortOrder: 'ascending',
        //     });
        const data = aboutData;

        /*         const query = await db.executeQuery(`
            query {
                allAboutPages {
                    missionStatement
                    summary1
                    summary2
                    research
                    workshops
                    tools
                    teaching
                    design
                }
            }`);

        if (query.errors) {
            console.error(query.errors)
            res.status(500).send(query.errors);
            return;
        }

        if (query.data.allAboutPages.length === 0) {
            res.status(204).send();
            return;
        }

        res.json(query.data.allAboutPages[0]); */
        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

module.exports = (req, res) => BuildData(req, res);