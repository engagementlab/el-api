
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Event data route
 *
 * ==========
 */

const GetAdjacent = async (list, results, res) => {
  const fields = 'name key -_id';
  // Get one next/prev event from selected event's sortorder
  const nextEvent = list
    .findOne(
      {
        enabled: true,
        date: {
          $gt: results.date,
        },
      },
      fields,
    )
    .limit(1);
  const prevEvent = list
    .findOne(
      {
        enabled: true,
        date: {
          $lt: results.date,
        },
      },
      fields,
    )
    .sort({ sortOrder: -1 })
    .limit(1);

  const nextPrevResults = {
    next: await nextEvent,
    prev: await prevEvent,
  };

  // Poplulate next/prev and output response
  try {
    const output = Object.assign(nextPrevResults, { event: results });
    return output;
  } catch (err) {
    res.status(500).send(err);
  }
};

const BuildData = async (req, res) => {
  const list = res.locals.db.list('Event').model;
  const options = { id: req.params.key };

  const fields = 'name date key shortDescription eventUrl';
  let data;

  try {
    // Get one event
    if (options.id) {
      const addtlFields = 'description.html images.public_id showButton buttonTxt';
      data = list.findOne({
        key: options.id,
      }, `${fields} ${addtlFields}`);
    } else if (options.archived) {
      data = list.find({
        enabled: true,
      },
      fields)
        .sort([['sortOrder', 'descending']]);
    } else {
      data = list.find({ enabled: true }, `${fields} -_id`)
        .sort([['sortOrder', 'ascending']]);
    }

    const results = await data.exec();

    if (results === null || results.length < 1) {
      res.status(204).send();
    }

    let resultObj = null;
    if (options.id) {
      resultObj = await GetAdjacent(list, results, res);
    } else {
      resultObj = results;
    }

    res.status(200).json(resultObj);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
};

exports.data = (req, res) => BuildData(req, res);
exports.keys = async (req, res) => {
  const list = res.locals.db.list('Event').model;
  const keys = await list.find({}, 'key -_id').exec();

  res.status(200).json(keys);
};
