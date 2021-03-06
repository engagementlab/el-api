/**
 * @fileoverview Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve jobs
 *
 * ==========
 */
const BuildData = async (req, res) => {
    const {
        db,
    } = res.locals;

    const jobs = db.model('Job');
    const fields = 'title description url -_id';

    try {
        // Get enabled jobs
        const data = await jobs.find({
            enabled: true,
        }, fields).sort([
            ['createdAt', 'descending']
        ]).exec();

        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

module.exports = (req, res) => BuildData(req, res);