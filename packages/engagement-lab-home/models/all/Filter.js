/**
 * Engagement Lab Homepage API
 *
 * @file Filters for numerous fields/models
 * @module models
 * @author Johnny Richardson, Eron Salling
 *
 * ==========
 */

const {
    Checkbox,
    Select,
    Text,
} = require('@keystonejs/fields');

const Filter = cloudinary => {
    /**
   * Model Fields
   * @memberof Filter
   */
    const fields = {
        name: {
            type: Text,
            isRequired: true,

            index: true,
        },
        category: {
            type: Select,
            label: 'Category of Filter',
            options: 'Person, Format, Keyword, Cohort',
            isRequired: true,
        },
        appears: {
            type: Select,
            label: 'Destination',
            note: 'Where will this filter apply?',
            options: 'Project, Publication',
            dependsOn: {
                category: ['Format', 'Keyword'],
            },
        },
        contactEmail: {
            type: Text,
            label: 'Email',
            required: false,
            dependsOn: {
                category: 'Person',
            },
        },
        current: {
            type: Checkbox,
            label: 'Is this the current cohort?',
            note: "Cohort will appear on the people page as 'Current'",
            required: false,
            dependsOn: {
                category: 'Cohort',
            },
        },
        previous: {
            type: Checkbox,
            label: 'Is this the most recent but not current cohort?',
            note: "Cohort will appear on the people page as 'Most Recent'",
            required: false,
            dependsOn: {
                category: 'Cohort',
            },
        },
    };

    return {
        fields,
    };
};

/**
 * Model Registration
 */
module.exports = Filter;

/* 
Filters.schema.pre('remove', next => {
    // Remove resource from all that referenced it
    keystone.list('Project').model.removeFilterRef(this._id, (err, removedCount) => {
        if (err) console.error(err);

        if (removedCount > 0) console.log(`Removed ${removedCount} references to '${this._id}'`);

        // Remove resource from all that referenced it
        keystone.list('Publication').model.removeFilterRef(this._id, (err, removedCount) => {
            if (err) console.error(err);

            if (removedCount > 0) console.log(`Removed ${removedCount} references to '${this._id}'`);

            next();
        });
    });
});

Filters.schema.statics.findFilter = (resourceId, callback) => {
    Filters.model.findById(resourceId, (err, result) => {
        if (err) console.error(err);

        callback(err, result);
    });
}; */