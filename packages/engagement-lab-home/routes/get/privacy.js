
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to retrieve privacy policy data
 *
 * ==========
 */
const BuildData = async (req, res) => {
  const { db } = res.locals;

  const privacy = db.list('Privacy').model;
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
