const express = require('express')
const app = express()
const morgan =require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person= require('./models/person')

app.use(express.static('dist'))

app.use(cors())
app.use(express.json())
morgan.token('body',(req)=>{return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time ms :body'))



// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]
// ALL PERSONS
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
// app.get('/api/persons/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const personId = persons.find(person => person.id === id)
//     if (personId) {
//         res.json(personId)
//     } else {
//         res.status(404).end()
//     }
// })
//DELETE A PERSON WITH ID 
app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result=>{
        res.status(204).end()
    })
})
//POST A NEW PERSON 
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.Name === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
        Name: body.Name,
        Number: body.Number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
// app.post('/api/persons', (req, res) => {
//     const body = req.body
//     if (!body.name || !body.number) {
//         return res.status(400).json({ error: 'name or number missing' })
//     }
// const personAlreadyExist = Person.some(person=>person.name===body.name)
// if(personAlreadyExist){
//     return res.status(400).json({error:'name must be unique'})
// }
    
//     const person = {
//         id: (() => {
//             return Math.floor(Math.random() * 100000000)
//         })(),
//         name: body.name,
//         number: body.number,
//     }
//     persons = persons.concat(person)

//     res.json(person)
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})