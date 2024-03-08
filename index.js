const express = require('express')
const app = express()
const morgan =require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person= require('./models/person')
const person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }

app.use(express.static('dist')) 
app.use(cors())
app.use(express.json())
morgan.token('body',(req)=>{return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time ms :body'))

app.get('/api/persons', (req,res) => {
Person.find({}).then(persons=>res.json(persons))
})
// SHOW PERSONS COUNT + TIME STAMP
app.get('/info', (req,res) => {
    Person.find({}).then(persons=>{
    const Personscount = persons.length
    const date = new Date().toString()
    res.send(`
        <p>Phonebook has info for ${Personscount} people</p>
        <p>${date}</p>
    `)
    })
})
// SHOW PERSONS WITH ID 
app.get('/api/persons/:id', (req, res,next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).end()
        }
      })
      .catch(error=>next(error))
})
//DELETE A PERSON WITH ID 
app.delete('/api/persons/:id', (req, res,next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result=>{
        res.status(204).end()
    })
    .catch(error => next(error))
})
//POST A NEW PERSON 
app.post('/api/persons', (req, res,next) => {
    const body = req.body

    if (!body.Name || !body.Number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    Person.findOne({ Name: body.Name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ error: 'name must be unique' })
        }

        const person = new Person({
            Name: body.Name,
            Number: body.Number,
        })

        person.save().then(savedPerson => {
            res.json(savedPerson)
        })
    })
    .catch(error=> next(error))
})
// Update phone number of an already existing Person 
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        Name: body.Name,
        Number: body.Number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})