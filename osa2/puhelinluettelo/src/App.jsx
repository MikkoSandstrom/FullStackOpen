import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Persons = ({persons, removePerson}) => (
    persons.map(person =>
      <p key={person.name}>{person.name} {person.number} <button onClick={()=>removePerson(person)}>delete</button></p>)
)

const Filter = ({filter, handleFilterChange}) => (
      <p>filter show with <input value={filter} onChange={handleFilterChange}/></p>
)

const PersonForm = ({name,number, handleNameChange, handleNumberChange, addPerson}) => (
  <form onSubmit={addPerson}>
    <div> 
      name: <input value={name} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={number} onChange={handleNumberChange}/> 
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={style}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personToUpdate = persons.find(person => person.name===newName)
    if (personToUpdate){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService
          .update(personToUpdate.id,{...personToUpdate, number: newNumber})
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(
              `Updated ${returnedPerson.name}`
            )
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          }).catch(error => {
                setErrorMessage(
                  `Information of ${personToUpdate.name} has already been removed from server`
                )
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
              })
      }}
    else {
      personService
      .create({name: newName, number: newNumber})
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }

  const removePerson = (personToDelete) =>{
    if (window.confirm(`Delete ${personToDelete.name} ?`)){
    personService
      .removeEntry(personToDelete.id)
      .then(()=>{
        setPersons(persons.filter(person => person.id != personToDelete.id ))
        setSuccessMessage(
          `Removed ${personToDelete.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(error => {
        setErrorMessage(
          `Information of ${personToDelete.name} has already been removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
         setPersons(persons.filter(n => n.id !== personToDelete.id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))  

  return (
    <div>
      <Notification message={successMessage} style={"success"}/>
      <Notification message={errorMessage} style={"error"}/>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

export default App