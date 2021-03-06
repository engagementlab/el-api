/**
 * @fileoverview Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve privacy policy data
 *
 * ==========
 */
const BuildData = async (req, res) => {
    const {
        db,
    } = res.locals;

    const privacy = db.model('Privacy');
    const fields = 'content.html lastUpdated -_id';


    try {
        // Get privacy text
        const query = privacy.findOne({}, fields);
        // Execute queries
        const data = await query.exec();

        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

module.exports = (req, res) => BuildData(req, res);