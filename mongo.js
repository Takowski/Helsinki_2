const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://stcomblez:${password}@cluster0.j5vxn8i.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    Name: String,
    Number: String,
})

const persons = mongoose.model('Persons', personSchema)

const name = process.argv[3]
const number = process.argv[4]

const person = new persons({
    Name: name,
    Number: number,
})


if (name || number) {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to the phonebook`)
        mongoose.connection.close()
    })
} else {
    persons
        .find({})
        .then(result => {
            console.log('Phonebook:')
            result.map(person => {
                console.log(person.Name, person.Number)
            })
            mongoose.connection.close()
        })
        .catch(error => {
            console.error('Error:', error)
        })
}