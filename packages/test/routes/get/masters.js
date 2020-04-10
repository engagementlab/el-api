
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to retrieve masters program page datta
 *
 * ==========
 */
const BuildData = async (req, res) => {
  const { db } = res.locals;
  const getPeople = req.params.key === 'people';

  const person = db.list('Person').model;
  const masters = db.list('Masters').model;

  const fields = 'programDescription.html applicationLink buttonTxt cohortYear -_id';
  const personFields = 'name title key image.public_id url';
  const personFieldsAddtl = 'bio.html twitterURL fbURL igURL linkedInURL githubURL websiteURL email phone';

  try {
    let data = {};
    if (getPeople) {
      const filter = db.list('Filter').model;

      // We have to get all cohorts and then assign their respective students to them in data object
      const filterQuery = filter.find({
        category: 'Cohort',
      }, 'key name _id')
        .sort([
          ['key', 'ascending'],
        ]);
      const cohorts = await filterQuery.exec();
      const orderedData = {};
      await Promise.all(
        cohorts.map(async (cohort) => {
          // Get all people in cohort and assign to object
          const query = await person.find({
            cohortYear: cohort._id,
            category: 'Masters',
          }, `${personFields} ${personFieldsAddtl} cohortYear -_id`)
            .sort([
              ['sortOrder', 'ascending'],
            ])
            .exec();

          data[cohort.key] = { name: cohort.name, people: query };
        }),
      );
      Object.keys(data).sort().forEach((key) => {
        orderedData[key] = data[key];
      });
      res.json(orderedData);
    } else {
      // Get masters program info
      const mastersQuery = masters.findOne({}, fields).lean();
      data = {
        masters: await mastersQuery.exec(),
      };

      // Get current cohort via filter year in masters page data
      const peopleQuery = person.find({ cohortYear: data.masters.cohortYear, category: 'Masters' }, `${personFields} -_id`)
        .sort([['sortOrder', 'ascending']]).lean();

      data.people = await peopleQuery.exec();

      res.json(data);
    }
  } catch (e) {
    res.status(500).send(e.toString());
  }
};

module.exports = (req, res) => BuildData(req, res);
