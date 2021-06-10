const File = require('../CustomFile');

class CloudinaryImage extends File.implementation {
    constructor() {
        super(...arguments);
        this.graphQLOutputType = 'CloudinaryImage_FileCustom';
    }

    gqlOutputFields() {
        return [`${this.path}: ${this.graphQLOutputType}`];
    }

    extendAdminMeta(meta) {
        const {
            many,
        } = this;
        return {
            ...meta,
            many,
        };
    }

    getFileUploadType() {
        return 'Upload';
    }

    getGqlAuxTypes({
        schemaName,
    }) {
        return [
            ...super.getGqlAuxTypes({
                schemaName,
            }),
            `
      """Mirrors the formatting options [Cloudinary provides](https://cloudinary.com/documentation/image_transformation_reference).
      All options are strings as they ultimately end up in a URL."""
      input CloudinaryImageFormatCustom {
        # Rewrites the filename to be this pretty string. Do not include '/' or '.'
        prettyName: String
        width: String
        height: String
        crop: String
        aspect_ratio: String
        gravity: String
        zoom: String
        x: String
        y: String
        format: String
        fetch_format: String
        quality: String
        radius: String
        angle: String
        effect: String
        opacity: String
        border: String
        background: String
        overlay: String
        underlay: String
        default_image: String
        delay: String
        color: String
        color_space: String
        dpr: String
        page: String
        density: String
        flags: String
        transformation: String
      }`,

            `extend type ${this.graphQLOutputType} {
            publicId: String
            publicUrlTransformed(transformation: CloudinaryImageFormatCustom): String
        }`
        ];
    }

    // Called on `User.avatar` for example
    gqlOutputFieldResolvers() {
        return {
            [this.path]: item => {
                const itemValues = item[this.path];
                if (!itemValues) {
                    return null;
                }

                // FIXME: This can hopefully be removed once graphql 14.1.0 is released.
                // https://github.com/graphql/graphql-js/pull/1520
                if (itemValues.id) itemValues.id = itemValues.id.toString();

                return {
                    publicId: this.fileAdapter.publicId(itemValues),
                    publicUrl: this.fileAdapter.publicUrl(itemValues),
                    publicUrlTransformed: ({
                        transformation,
                    }) =>
                        this.fileAdapter.publicUrlTransformed(itemValues, transformation),
                    ...itemValues,
                };
            },
        };
    }
}


module.exports = {
    Implementation: CloudinaryImage,
    MongoIntegerInterface: File.adapters.mongoose,
    // KnexIntegerInterface: KnexCloudinaryImageInterface,
};