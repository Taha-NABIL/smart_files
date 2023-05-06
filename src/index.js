import fs from "fs";
import express from "express";
import { uploadFile, downloadFile, connectDB } from "./lib/mongodb.js";
import upload from "./middlewares/fileUpload.js";
import FileService from "./api/Service.js";
import amqp from "amqplib";
//import { connection } from "mongoose";

connectDB();

const connection = await amqp.connect('amqps://nwwszvsu:wMe_0C8gaLu5MAcJzERBh0_Xfwgm2XQ8@stingray.rmq.cloudamqp.com/nwwszvsu');
const channel = await connection.createChannel();
const queueName = 'files';

const app = express();
app.use(express.json());

/**
 * @route GET /example
 * @desc Example route
 */
app.post("/create-example", (req, res) => {
  const filename = req.body.filename;
  // Create a new file
  FileService.create(filename);
  res.send("File created successfully");
});

/**
 * @route GET /example
 * @desc Example route
 */
app.get("/", async (req, res) => {
  const files = await FileService.list();
  console.log(files);
  res.json(files);
});

/**
 * @route POST /upload
 * @desc Uploads file to DB
 */
app.post("/try", upload.single("file"), (req, res) => {
  const filename = req.file.originalname;
  const filepath = req.file.path;

  uploadFile(filepath, filename)
    .then(() => {
      res.send("File uploaded successfully");
    })
    .catch((error) => {
      console.log(error);
      res.send("Error uploading file");
    })
    .finally(() => {
      // Delete the file from the uploads folder
      fs.unlink(filepath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
});

/**
 * @route get /download/:id
 * @desc Download file from DB
 */
app.get("/download/:id", async (req, res) => {
  const fileId = req.params.id;
  await downloadFile(fileId, res);
});


app.get("/transcrypt", async (req, res) => {
  
  await channel.sendToQueue(queueName, Buffer.from("yoooo"));
  
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
