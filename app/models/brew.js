const mongoose = require('mongoose')
const comment = require('./comment')

const brewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateStarted: String,
  style: {
    beerStyle: String,
    amount: String
  },
  owner: String,
  email: String,
  steep: {
    type: Array
  },
  boilTime: String,
  boil: {
    type: Array
  },
  postBoil: {
    type: Array
  },
  primary: String,
  secondary: String,
  tastingNotes: String,
  // pictures: [picture.schema],
  comments: [comment.schema]
}, {
  timestamps: true
})

module.exports = mongoose.model('Brew', brewSchema)
