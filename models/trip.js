const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
  userId: { type: String, required: true }, //store the user who created this trip
  name: { type: String, required: true }, //store the name of the trip
  restaurants: { type: Array, required: false }, //store the restaurants visited during this trip
  isComplete: { type: Boolean, required: false } //whether this trip is current(this is optional)
});

module.exports = mongoose.model('Trip', tripSchema);
