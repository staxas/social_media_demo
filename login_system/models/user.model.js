var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  role: String,
  avatar: String,
  name: { type: String, index: true },
  address: String,
  city: String,
  zipcode: String,
  lat: Number,
  lng: Number,
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followed_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
