const mongoose = require('mongoose')
const comment = require('./comment')

const brewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  style: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  steep: {
    type: Array
  },
  boil: {
    type: Array
  },
  postBoil: {
    type: Array
  },
  tastingNotes: String,
  // pictures: [picture.schema],
  comments: [comment.schema]
}, {
  timestamps: true
})

module.exports = mongoose.model('Brew', brewSchema)
