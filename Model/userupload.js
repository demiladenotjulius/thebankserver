const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true,
        
    },
    caption: {
        type: String,
        required: true,
    }

})

const Upload = mongoose.model('uploadModel', uploadSchema)

module.exports = Upload;