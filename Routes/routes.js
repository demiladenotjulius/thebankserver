const express = require('express');
const userRouter = express.Router();
const { registerUser, loginUser } = require('../Controller/controller');
const Upload = require('../Model/userupload');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');

require('dotenv').config();

// Set up AWS credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: 'latest' });

const storage = multer.memoryStorage(); // Use memory storage for multer

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

// Route to handle image requests and proxy them to S3
userRouter.get('/images/:key', async (req, res) => {
    try {
        const { key } = req.params;

        // Fetch image from S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };
        const data = await s3.getObject(params).promise();

        // Serve image to frontend
        res.set('Content-Type', data.ContentType);
        res.send(data.Body);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Error fetching image' });
    }
});

// Route to handle file uploads
userRouter.post('/upload', uploadFile.single('image'), async (req, res) => {
    try {
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Date.now() + '-' + req.file.originalname,
            Body: req.file.buffer
        };

        // Upload image to S3
        const data = await s3.upload(uploadParams).promise();

        // Save image details to database
        const newUpload = await Upload.create({
            image: data.Location,
            caption: req.body.caption
        });
        
        res.status(201).json({ message: 'Upload created successfully', upload: newUpload });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

// Route to fetch all uploads from the database
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




