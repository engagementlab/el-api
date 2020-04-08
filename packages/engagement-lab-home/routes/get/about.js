
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to retrieve about page data
 *
 * ==========
 */
const BuildData = async (req, res) => {
  const { db } = res.locals;

  // const person = db.list('Person').model;
  // const partner = db.list('Partner').model;
  // const about = db.list('About').model;

  const aboutFields = 'missionStatement summary1 summary2 images.public_id research workshops tools teaching design -_id';
  const partnerFields = 'name image.public_id url -_id';
  const personFields = 'name title key image.public_id url -_id';

  try {
    /*     // Get about
    const aboutData = about.findOne({}, aboutFields);
    // Get a couple featured projects
    const partnersData = partner.find({}, partnerFields);
    // Get faculty and staff
    const peopleData = person.find({ category: { $in: ['faculty leadership', 'staff'] } }, personFields)
      .sort([['sortOrder', 'ascending']]);
    const data = {
      about: await aboutData.exec(),
      partners: await partnersData.exec(),
      people: await peopleData.exec(),
    };
 */

    const data = await db.executeQuery(`
      query {
        allAbouts {
          missionStatement
          summary1
          summary2
          images {
            image {
              publicUrl
            }
          }
          research
          workshops
          tools
          teaching
          design
        }
      }`);

    res.json(data.data.allAbouts[0]);
  } catch (e) {
    res.status(500).send(e.toString());
  }
};

module.exports = (req, res) => BuildData(req, res);
