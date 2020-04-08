
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Publication data route
 *
 * ==========
 */

const GetAdjacent = async (list, results, res) => {
  const fields = 'name key -_id';
  // Get one next/prev project from selected project's sortorder
  const nextProject = list
    .findOne(
      {
        enabled: true,
        sortOrder: {
          $gt: results.sortOrder,
        },
      },
      fields,
    )
    .limit(1);
  const prevProject = list
    .findOne(
      {
        enabled: true,
        sortOrder: {
          $lt: results.sortOrder,
        },
      },
      fields,
    )
    .sort({ sortOrder: -1 })
    .limit(1);

  const nextPrevResults = {
    next: await nextProject,
    prev: await prevProject,
  };

  // Poplulate next/prev and output response
  try {
    const output = Object.assign(nextPrevResults, { project: results });
    return output;
  } catch (err) {
    res.status(500).send(err);
  }
};

const BuildData = async (req, res) => {
  const list = res.locals.db.list('Publication').model;
  const options = { id: req.params.key };

  const fields = 'key title author date blurb context downloadUrls purchaseUrls -_id';
  let data;

  try {
    // Get one publication
    if (options.id) {
      const addtlFields = 'description challengeTxt strategyTxt resultsTxt externalLinkUrl githubUrl projectImages';
      data = list.findOne({
        key: options.id,
      }, `${fields} ${addtlFields}`)
        .populate({
          path: 'principalInvestigator',
          select: 'name -_id',
        })
        .populate({
          path: 'format',
          select: 'name -_id',
        });
    } else {
      data = list.find({ enabled: true }, `${fields} -_id`)
        .sort([['date', 'descending']])
        .populate({
          path: 'form',
          select: 'key -_id',
        })
        .populate({
          path: 'articleResource',
          select: 'file.url -_id',
        });
    }

    const results = await data.exec();

    if (results === null || results.length < 1) {
      res.status(204).send();
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
};

exports.data = (req, res) => BuildData(req, res);
exports.keys = async (req, res) => {
  const list = res.locals.db.list('Publication').model;
  const keys = await list.find({}, 'key -_id').exec();

  res.status(200).json(keys);
};
