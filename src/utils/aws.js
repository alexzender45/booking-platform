const multer = require('multer');
const { FILE_SIZE } = require('../core/config')

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
});
const upload = multer({
    storage,
    limits: {
        fileSize: FILE_SIZE
    }
}).single('image');

module.exports = { upload }