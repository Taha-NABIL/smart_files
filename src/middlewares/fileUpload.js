import multer from "multer";

// Define storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, process.env.UPLOADS_PATH);
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create an instance of the multer middleware with the above storage configuration
const upload = multer({ storage: storage });

export default upload;
