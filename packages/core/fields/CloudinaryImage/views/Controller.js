import FieldController from '../../File/views/Controller';

export default class FileController extends FieldController {
  getQueryFragment = () => `
    ${this.path} {
       id
       path
       filename
       mimetype
       encoding
       publicId
    }
  `;
}