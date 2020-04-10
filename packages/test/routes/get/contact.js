
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to retrieve get involved/contact data
 *
 * ==========
 */
const BuildData = async (req, res) => {
  const { db } = res.locals;

  const contact = db.list('Contact').model;
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
