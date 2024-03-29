require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
morgan.token('body', (req) => req.method==="POST" ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
    })
  })

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for 2 people</p><p>${Date()}`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person =>{ 
      if (person) {
          res.json(person)
      } else {
          res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }
  
  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson =>{
    res.json(savedPerson)
  })
})

app.put('/api/persons/:id', (req, res, next) =>{
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})