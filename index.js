const express = require('express')
const app = express()

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
// ALL PERSONS
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
// SHOW PERSONS COUNT + TIME STAMP
app.get('/info', (req, res) => {
    const Personscount = persons.length
    const date = new Date().toString()
    res.send(`
        <p>Phonebook has info for ${Personscount} people</p>
        <p>${date}</p>
    `)
})
// SHOW PERSONS WITH ID 
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const personId = persons.find(person => person.id === id)
    if (personId) {
        res.json(personId)
    } else {
        res.status(404).end()
    }

})
//DELETE A PERSON WITH ID 
app.delete('/api/persons/:id',(req,res)=>{
    const id= Number(req.params.id)
    persons=persons.filter(person=>person.id !==id)
    res.status(204).end()
})




const Port = 3001
app.listen(Port, () => {
    console.log(`Server running on port ${Port}`)
})