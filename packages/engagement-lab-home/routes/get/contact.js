/**
 * @fileoverview Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve get involved/contact data
 *
 * ==========
 */
const BuildData = async (req, res) => {
    const {
        db,
    } = res.locals;

    const contact = db.model('Contact');
    const fields = 'name blurb students community -_id';


    try {
        // Get contact text
        const query = contact.findOne({}, fields);
        // Execute queries
        const data = await query.exec();

        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

module.exports = (req, res) => BuildData(req, res);