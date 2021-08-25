/* eslint-disable import/no-extraneous-dependencies */
/**
 * Mapping Impactful Media CMS
 *
 * Report
 * @module models
 * @author Johnny Richardson
 *
 * ==========
 */

const {
    Text,
} = require('@keystonejs/fields');
const {
    Markdown,
} = require('@keystonejs/fields-markdown');

const AzureAdapter = require('../../../core/adapters/Azure');
const {
    CloudinaryImage,
} = require('../../../core/fields');
const CustomFile = require('../../../core/fields/CustomFile');

const ContentRefreshHook = require('../refreshHook');

const adapter = new AzureAdapter({
    accountName: process.env.AZURE_STORAGE_ACCOUNT,
    accountKey: process.env.AZURE_STORAGE_ACCESS_KEY,
    containerName: 'downloads',
});

const Report = cloudinary => {
    /**
     * Model Fields
     * @memberof Report
     */
    const fields = {
        name: {
            type: Text,
            defaultValue: 'Report Page',
            access: false,
            isRequired: true,
        },
        blurb: {
            type: Markdown,
            isRequired: true,
        },
        image: {
            type: CloudinaryImage,
            adapter: cloudinary,
            folder: 'mapping-impactful-media',
        },
        reportFile: {
            type: CustomFile,
            isRequired: true,
            folder: 'miml',
            adapter,
        },
    };

    /**
     * Model Options
     * @memberof Report
     * @see https://www.keystonejs.com/api/create-list
     */
    const options = {
        label: 'Report Page',
        plural: 'Report',
        singular: 'MIM Report',
        path: 'report',
        listQueryName: 'MimReportPages',
        itemQueryName: 'MimReportPage',
        adminConfig: {
            defaultColumns: 'label',
        },
        access: {
            create: false,
            delete: false,
        },
    };

    const hooks = {
        // used to force-refresh Gatsby content model on all changes
        beforeChange: ContentRefreshHook,
    };
    
    return {
        hooks,
        fields,
        options,
    };
};

/**
 * Model Registration
 */
module.exports = Report;