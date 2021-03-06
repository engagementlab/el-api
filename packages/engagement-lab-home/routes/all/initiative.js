/**
 * @fileoverview Engagement Lab Content and Data API
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @file Route to retrieve home data
 *
 * ==========
 */
const buildData = async (req, res) => {
    const {
        db,
    } = res.locals;
    const initiative = db.model('Initiative');
    const fields = 'name key description longDescription projects -_id';
    try {
        // Get initiative text
        const initiativeData = initiative.findOne({
            key: req.params.key,
        }, fields).populate({
            path: 'projects',
            select: 'name key -_id',
            options: {
                sort: 'name',
            },
        });

        // Execute queries
        const data = await initiativeData.exec();

        res.json(data);
    } catch (e) {
        res.status(500).send(e.toString());
    }
};

/*
 * Get data
 */
exports.get = (req, res) => {
    const options = {};
    options.key = req.params.key;

    return buildData(options, res);
};

exports.data = (req, res) => BuildData(req, res);
exports.keys = async (req, res) => {
    const list = res.locals.db.model('Initiative');
    const keys = await list.find({}, 'key -_id').exec();

    res.status(200).json(keys);
};