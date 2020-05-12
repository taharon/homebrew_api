const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  owner: {
    id: String,
    email: String
  }
}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('Comment', commentSchema),
  schema: commentSchema
}
