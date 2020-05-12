// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Brew = require('../models/brew')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /comments
router.get('/comments', (req, res, next) => {
  const commentsArray = []
  Brew.find()
    .then(brews => brews.forEach(brew => commentsArray.push(brew.comments)))
    .then(() => [].concat.apply([], commentsArray))
    .then(flatComments => res.status(200).json({comments: flatComments}))
    .catch(next)
})

// SHOW
// GET /comments/5a7db6c74d55bc51bdf39793
router.get('/comments/:id', (req, res, next) => {
  const commentsArray = []
  Brew.findById(req.params.id)
    .then(handle404)
    .then(brews => brews.forEach(brew => commentsArray.push(brew.comments)))
    .then(() => [].concat.apply([], commentsArray))
    .then(flatComments => flatComments.filter(comment => comment._id == req.params.id)[0])
    .then(comment => res.status(200).json({ comment }))
})

// CREATE
// ID here is the ID of the brew to add the comment to
// POST /comments
router.post('/comments/:id', requireToken, (req, res, next) => {
  // set owner of new example to be current brew
  Brew.findById(req.params.id)
    .then(handle404)
    .then(brew => {
      req.body.comment.owner = {}
      req.body.comment.owner._id = req.user.id
      req.body.comment.owner.email = req.user.email
      brew.comments.push(req.body.comment)
      return brew.save()
    })
    .then(brew => {
      res.status(201).json({comment: brew.comments[brew.comments.length - 1].toObject()})
    })
    .catch(next)
})

// UPDATE
// requires that a brewId is passed so I know which brew to update a comment of
// PATCH /comments/5a7db6c74d55bc51bdf39793
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  Brew.findById(req.body.brewId)
    .then(handle404)
    .then(brew => brew.comments.id(req.params.id))
    .then(comment => {
      requireOwnership(req, comment)
      comment.text = req.body.comment.text
      return comment.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

// DESTROY
// requires that a brewId is passed so I know which brew to delete a comment of
// DELETE /comments/5a7db6c74d55bc51bdf39793
router.delete('/comments/:id', requireToken, (req, res, next) => {
  Brew.findById(req.body.brewId)
    .then(handle404)
    .then(brew => brew.comments.id(req.params.id))
    .then(handle404)
    .then(comment => {
      requireOwnership(req, comment)
      comment.remove()
      comment.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

module.exports = router
