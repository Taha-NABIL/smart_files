import { Schema, model } from 'mongoose';

const FileSchema = new Schema({
  name: String,
});

export default model('File', FileSchema);
