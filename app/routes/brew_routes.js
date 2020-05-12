// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for brews
const Brew = require('../models/brew')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { brew: { title: '', text: 'foo' } } -> { brew: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /brews
router.get('/brews', requireToken, (req, res, next) => {
  Brew.find()
    .then(brews => {
      // `brews` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return brews.map(brew => brew.toObject())
    })
    // respond with status 200 and JSON of the brews
    .then(brews => res.status(200).json({ brews: brews }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /brews/5a7db6c74d55bc51bdf39793
router.get('/brews/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Brew.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "brew" JSON
    .then(brew => res.status(200).json({ brew: brew.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /brews
router.post('/brews', requireToken, (req, res, next) => {
  // set owner of new brew to be current user
  req.body.brew.owner = req.user.id

  Brew.create(req.body.brew)
    // respond to succesful `create` with status 201 and JSON of new "brew"
    .then(brew => {
      res.status(201).json({ brew: brew.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /brews/5a7db6c74d55bc51bdf39793
router.patch('/brews/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.brew.owner

  Brew.findById(req.params.id)
    .then(handle404)
    .then(brew => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, brew)

      // pass the result of Mongoose's `.update` to the next `.then`
      return brew.updateOne(req.body.brew)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /brews/5a7db6c74d55bc51bdf39793
router.delete('/brews/:id', requireToken, (req, res, next) => {
  Brew.findById(req.params.id)
    .then(handle404)
    .then(brew => {
      // throw an error if current user doesn't own `brew`
      requireOwnership(req, brew)
      // delete the brew ONLY IF the above didn't throw
      brew.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
