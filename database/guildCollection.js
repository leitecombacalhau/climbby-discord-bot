const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  Guild : String,
  Prefix : String,
  Users: Array,
})

module.exports = mongoose.model('guild', Schema)