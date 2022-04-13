class GenericResponseError  {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

function throwError(message, code = 400) {
  throw new GenericResponseError(code, message);
}
const handleCastErrorExceptionForInvalidObjectId = () => throwError('Invalid Parameter. Resource Not Found');

const isCastError = (error = '') => error.toString().indexOf('CastError') !== -1;

module.exports = {
  throwError,
  isCastError,
  handleCastErrorExceptionForInvalidObjectId
};
