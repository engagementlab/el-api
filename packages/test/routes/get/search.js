
/**
 * @fileoverview Engagement Lab Website v2.x content service
 * @copyright Engagement Lab at Emerson College, 2020
 *
 * @author Johnny Richardson
 * @description Query elastisearch cluster
 *
 * ==========
 */

async function find(nameString, res) {
  try {
    const {
      body,
    } = await global.elasti.search({
      index: ['listing', 'event', 'publication'],
      body: {
        query: {
          query_string: {
            query: `${nameString}*`,
            fields: ['_type', 'name', 'key', 'content'],
          },
        },
        highlight: {
          require_field_match: true,
          fields: {
            name: {
              pre_tags: [
                '<mark>',
              ],
              post_tags: [
                '</mark>',
              ],
            },
            content: {
              pre_tags: [
                '<mark>',
              ],
              post_tags: [
                '</mark>',
              ],
            },
          },
        },
      },
    });
    res.status(200).json({
      status: 200,
      data: body.hits.hits,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = (req, res) => {
  find(req.params.string, res);
};
