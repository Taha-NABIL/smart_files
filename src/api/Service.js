import File from './Model.js';

function create(name) {
  const file = new File({ name });
  return file.save();
}

function list() {
  return File.find();
}

export default {
  create,
  list,
};
