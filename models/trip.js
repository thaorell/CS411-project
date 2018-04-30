const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  restaurants: { type: Array, required: false },
  isComplete: { type: Boolean, required: false },
});

module.exports = mongoose.model('Trip', tripSchema);
