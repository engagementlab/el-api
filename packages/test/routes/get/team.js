
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Route to retrieve team/person data
 *
 * ==========
 */
const BuildData = async (req, res) => {
  const { db } = res.locals;
  const options = { id: req.params.key };
  const person = db.list('Person').model;
  const fields = 'name title key category image.public_id url cohortYear';
  const personFields = 'bio.html twitterURL fbURL igURL linkedInURL githubURL websiteURL email phone';

  try {
    let data;
    // Get person data
    if (options.id) {
      const query = person.findOne({ key: options.id }, `${fields} ${personFields} -_id`).populate({
        path: 'cohortYear',
        select: 'name -_id',
      });

      // Execute query
      data = await query.exec();
      res.json(data);
    }

    // Get all people
    else {
      const filter = db.list('Filter').model;

      // We have to get the current cohort year manually since mongoose can't join,
      // and returning all masters people is inefficient
      filter.findOne({
        current: true,
        category: 'Cohort',
      }, '_id').exec(async (error, currentYr) => {
        // Get faculty, staff, board
        const peopleData = person.find({
          category: {
            $in: ['faculty leadership', 'staff', 'advisory board', 'faculty fellows'],
          },
        }, `${fields} -_id`)
          .sort([
            ['sortOrder', 'ascending'],
          ]);

        // Get current cohort
        const studentData = person.find({
          cohortYear: currentYr,
          category: 'Masters',
        }, `${fields} cohortYear -_id`)
          .sort([
            ['sortOrder', 'ascending'],
          ]);

        // Execute queries
        data = {
          staff: await peopleData.exec(),
          students: await studentData.exec(),
        };

        res.json(data);
      });
    }
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
  const list = res.locals.db.list('Person').model;
  const keys = await list.find({}, 'key -_id').exec();

  res.status(200).json(keys);
};
