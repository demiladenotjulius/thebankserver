const express = require('express');
const userRouter = express.Router();
const { registerUser, loginUser } = require('../Controller/controller');
const Upload = require('../Model/userupload');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); 
    } else {
        cb(new Error('Only JPEG and PNG files are allowed'), false); 
    }
};

const uploadFile = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

userRouter.post('/user-register', registerUser);
userRouter.post('/user-login', loginUser);

userRouter.post('/upload', uploadFile.single('image'), async (req, res) => {
    try {
        const newUpload = await Upload.create({
            Image: req.file.filename,
            Caption: req.body.caption // Extract caption from request body

        });

        res.status(201).json({ message: 'Upload created successfully', upload: newUpload });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




userRouter.get('/uploads', async (req, res) => {
    try {
        const uploads = await Upload.find();
        res.status(200).json(uploads); 
    } catch (error) {
        console.error('Error fetching uploads:', error); 
        res.status(500).json({ error: 'Error fetching uploads' });
    }
});

module.exports = userRouter;


