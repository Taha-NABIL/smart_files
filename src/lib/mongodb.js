import fs from 'fs';
import mongodb from 'mongodb';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

/**
 *  Uploads a file to MongoDB
 * @param {*} filepath 
 * @param {*} filename 
 * @returns {Promise}- A promise that resolves when the upload is complete
 */
export async function uploadFile(filepath, filename) {
  // Connect to MongoDB
  const client = await mongodb.MongoClient.connect(MONGO_URI);
  const db = client.db();

  // Initialize a GridFS bucket object
  const bucket = new mongodb.GridFSBucket(db);

  // Open a read stream for the file you want to upload
  const stream = fs.createReadStream(filepath);

  // Create a new GridFS file in the bucket
  const uploadStream = bucket.openUploadStream(filename);

  // Pipe the read stream into the GridFS upload stream
  stream.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
  });
}

/**
 * Downloads a file from MongoDB
 * @param {*} fileId 
 */
export async function downloadFile(fileId, res) {
  // Connect to MongoDB
  const client = await mongodb.MongoClient.connect(MONGO_URI);
  const db = client.db();

  // Initialize a GridFS bucket object
  const bucket = new mongodb.GridFSBucket(db);

  // Create a read stream for the file you want to download
  const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(fileId));
  
  const timestamp = new Date().getTime();

  if (res) {
    res.attachment(`${timestamp}.mp3`);
    downloadStream.pipe(res);
    return;
  }

  // Create a write stream to save the downloaded file
  const writeStream = fs.createWriteStream(`./downloads/${timestamp}.mp3`);

  // Pipe the download stream into the write stream
  downloadStream.pipe(writeStream);

  // Wait for the download to finish
  writeStream.on('finish', () => {
    console.log('File downloaded!');
    client.close();
  });
}


export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
