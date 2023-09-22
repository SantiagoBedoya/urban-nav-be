const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    permissions: [Number],
  },
  {collection: 'Role'},
);

const model = mongoose.model('Role', roleSchema);
module.exports = model;
