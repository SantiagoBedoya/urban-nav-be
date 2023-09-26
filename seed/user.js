const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    roleId: String,
  },
  {collection: 'User'},
);

const model = mongoose.model('User', userSchema);
module.exports = model;
