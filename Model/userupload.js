const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({

    Image: {
        type: String,
        required: true,
        
    },
    Caption: {
        type: String,
        required: true,
    }

})

const Upload = mongoose.model('uploadModel', uploadSchema)

module.exports = Upload ;