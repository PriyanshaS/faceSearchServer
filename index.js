const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://priyansha2024cs1044:b9qDVvWC0BqfWLWH@picture.up3nspo.mongodb.net/?retryWrites=true&w=majority&appName=picture';

// Set up multer for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB Atlas
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error(err);
        process.exit(1); // Exit process on connection failure
    }
}

connectToMongoDB();

// Upload endpoint
app.post('/upload', upload.single('picture'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer; // Get file buffer
        const db = client.db(); // Get database from client
        const collection = db.collection('images'); // Get collection

        // Insert image data into MongoDB
        const result = await collection.insertOne({ image: fileBuffer });
        res.send('Picture uploaded successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint for serving random pictures
app.get('/get-picture', async (req, res) => {
    try {
        const db = client.db(); // Get database from client
        const collection = db.collection('images'); // Get collection

        // Query image data from MongoDB
        const result = await collection.find({}).toArray();

        // Send array of image data as response
        print(result);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
